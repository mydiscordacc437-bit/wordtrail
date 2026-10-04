import { supabase, isSupabaseConfigured, isSupabaseReady } from './config.js';

export { isSupabaseConfigured, isSupabaseReady };

function requireClient() {
  if (!supabase) {
    throw new Error('Supabase is unavailable. Check js/config.js and your network connection.');
  }
  return supabase;
}
function assertUserId(userId) {
  if (typeof userId !== 'string' || userId.length < 10 || userId.length > 80) {
    throw new Error('A valid signed-in user is required.');
  }
}
function cleanText(value, limit = 500) {
  return String(value == null ? '' : value).replace(/[<>\u0000-\u001f\u007f-\u009f]/g, '').slice(0, limit);
}
function throwIfError(result) {
  if (result.error) throw result.error;
  return result.data;
}

export async function fetchUserSnapshot(userId) {
  const client = requireClient();
  assertUserId(userId);
  const [profileResult, wordbookResult, scoresResult] = await Promise.all([
    client.from('profiles').select('id,username,streak_count,last_active_date,english_level,ui_language,gloss_language,show_gloss').eq('id', userId).maybeSingle(),
    client.from('user_wordbook').select('word_id,mastery_level,notes,saved_at').eq('user_id', userId),
    client.from('quiz_results').select('game_type,score,total,created_at').eq('user_id', userId).order('created_at', { ascending: false }).limit(100)
  ]);
  const profile = throwIfError(profileResult);
  const wordbook = throwIfError(wordbookResult) || [];
  const scores = throwIfError(scoresResult) || [];
  return {
    profile,
    wordbook: wordbook.filter(row => typeof row.word_id === 'string'),
    scores: scores.filter(row => Number.isFinite(row.score) && Number.isFinite(row.total))
  };
}

export async function upsertProfile(userId, profile) {
  const client = requireClient();
  assertUserId(userId);
  // Store setup preferences with the account profile so a new device can resume the same onboarding choices.
  const payload = {
    id: userId,
    username: cleanText(profile && profile.username, 40),
    streak_count: Number.isInteger(profile && profile.streakCount) ? Math.max(0, Math.min(profile.streakCount, 1000000)) : 0,
    last_active_date: /^\d{4}-\d{2}-\d{2}$/.test(profile && profile.lastActiveDate || '') ? profile.lastActiveDate : null,
    english_level: ['beginner', 'intermediate', 'advanced', 'unsure'].includes(profile && profile.englishLevel) ? profile.englishLevel : null,
    ui_language: ['en', 'es', 'hi', 'bn', 'fr'].includes(profile && profile.uiLanguage) ? profile.uiLanguage : 'en',
    gloss_language: ['en', 'es', 'hi', 'bn', 'fr'].includes(profile && profile.glossLanguage) ? profile.glossLanguage : 'es',
    show_gloss: profile && profile.showGloss === true
  };
  const result = await client.from('profiles').upsert(payload, { onConflict: 'id' }).select('id,username,streak_count,last_active_date,english_level,ui_language,gloss_language,show_gloss').single();
  return throwIfError(result);
}

export async function syncWordbook(userId, progress) {
  const client = requireClient();
  assertUserId(userId);
  const savedIds = Array.isArray(progress && progress.savedIds)
    ? [...new Set(progress.savedIds.filter(id => typeof id === 'string' && /^[a-z0-9-]{1,64}$/.test(id)))].slice(0, 500)
    : [];
  const mastery = progress && progress.masteryLevels && typeof progress.masteryLevels === 'object' ? progress.masteryLevels : {};
  const notes = progress && progress.wordNotes && typeof progress.wordNotes === 'object' ? progress.wordNotes : {};
  if (savedIds.length) {
    const rows = savedIds.map(wordId => ({
      user_id: userId,
      word_id: wordId,
      mastery_level: ['Easy', 'Medium', 'Hard'].includes(mastery[wordId]) ? mastery[wordId] : 'Medium',
      notes: cleanText(notes[wordId], 500)
    }));
    const upsertResult = await client.from('user_wordbook').upsert(rows, { onConflict: 'user_id,word_id' });
    throwIfError(upsertResult);
  }
  const existingResult = await client.from('user_wordbook').select('word_id').eq('user_id', userId);
  const existing = throwIfError(existingResult) || [];
  const removeIds = existing.map(row => row.word_id).filter(id => !savedIds.includes(id));
  if (removeIds.length) {
    const deleteResult = await client.from('user_wordbook').delete().eq('user_id', userId).in('word_id', removeIds);
    throwIfError(deleteResult);
  }
  return { synced: savedIds.length, removed: removeIds.length };
}

export async function syncUserSnapshot(userId, username, progress) {
  const snapshot = progress || {};
  await upsertProfile(userId, {
    username,
    streakCount: snapshot.streak,
    lastActiveDate: snapshot.lastPlayed,
    englishLevel: snapshot.level,
    uiLanguage: snapshot.uiLanguage,
    glossLanguage: snapshot.glossLanguage,
    showGloss: snapshot.showGloss
  });
  const wordbook = await syncWordbook(userId, snapshot);
  return { wordbook };
}

export async function saveQuizResult(userId, result) {
  const client = requireClient();
  assertUserId(userId);
  const score = Number.isInteger(result && result.score) ? result.score : 0;
  const total = Number.isInteger(result && result.total) ? result.total : 0;
  if (total < 1 || score < 0 || score > total || total > 10000) return null;
  const gameType = /^[a-z0-9_-]{1,40}$/.test(result && result.gameType || '') ? result.gameType : 'practice';
  const randomPart = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const payload = {
    user_id: userId,
    game_type: gameType,
    score,
    total,
    idempotency_key: cleanText(result && result.idempotencyKey || randomPart, 100)
  };
  const savedResult = await client.from('quiz_results').insert(payload).select('id,game_type,score,total,created_at').single();
  return throwIfError(savedResult);
}

export async function syncGuestSnapshot(userId, username, progress) {
  const snapshot = progress || {};
  const hasGuestSetup = Boolean(snapshot.level || snapshot.uiLanguage && snapshot.uiLanguage !== 'en' || snapshot.glossLanguage && snapshot.glossLanguage !== 'es' || snapshot.showGloss === true);
  const remote = await fetchUserSnapshot(userId);
  const remoteWords = remote.wordbook || [];
  const combinedIds = [...new Set([
    ...remoteWords.map(row => row.word_id),
    ...(Array.isArray(snapshot.savedIds) ? snapshot.savedIds : [])
  ])];
  const combinedMastery = Object.fromEntries(remoteWords.map(row => [row.word_id, row.mastery_level]));
  const combinedNotes = Object.fromEntries(remoteWords.map(row => [row.word_id, row.notes || '']));
  Object.assign(combinedMastery, snapshot.masteryLevels || {});
  Object.assign(combinedNotes, snapshot.wordNotes || {});
  const remoteStreak = Number.isInteger(remote.profile && remote.profile.streak_count) ? remote.profile.streak_count : 0;
  const guestStreak = Number.isInteger(snapshot.streak) ? snapshot.streak : 0;
  const remoteDate = remote.profile && remote.profile.last_active_date || null;
  const guestDate = typeof snapshot.lastPlayed === 'string' ? snapshot.lastPlayed : null;
  const newestDate = remoteDate && guestDate ? (remoteDate > guestDate ? remoteDate : guestDate) : remoteDate || guestDate;
  await upsertProfile(userId, {
    username: username || remote.profile && remote.profile.username || '',
    streakCount: remoteDate === guestDate ? Math.max(remoteStreak, guestStreak) : newestDate === remoteDate ? remoteStreak : guestStreak,
    lastActiveDate: newestDate,
    englishLevel: snapshot.level || remote.profile && remote.profile.english_level,
    uiLanguage: hasGuestSetup ? snapshot.uiLanguage : remote.profile && remote.profile.ui_language,
    glossLanguage: hasGuestSetup ? snapshot.glossLanguage : remote.profile && remote.profile.gloss_language,
    showGloss: hasGuestSetup ? snapshot.showGloss === true : remote.profile && remote.profile.show_gloss === true
  });
  await syncWordbook(userId, { savedIds: combinedIds, masteryLevels: combinedMastery, wordNotes: combinedNotes });
  const total = Number.isInteger(snapshot.totalAnswered) ? Math.max(0, snapshot.totalAnswered) : 0;
  const score = Number.isInteger(snapshot.totalCorrect) ? Math.max(0, Math.min(snapshot.totalCorrect, total)) : 0;
  if (total) {
    const client = requireClient();
    const result = await client.from('quiz_results').upsert({
      user_id: userId,
      game_type: 'guest_import',
      score,
      total,
      idempotency_key: 'guest-import-v1'
    }, { onConflict: 'user_id,idempotency_key' }).select('id').single();
    throwIfError(result);
  }
  return { wordbook: { synced: combinedIds.length } };
}
