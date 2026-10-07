import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { USAGE_CONCEPTS, USAGE_ROUNDS, CONVERSATION_ROUNDS } from '../supabase-app/js/usage-data.js';

assert.equal(USAGE_CONCEPTS.length, 125);
assert.equal(USAGE_ROUNDS.length, 1000);
assert.equal(new Set(USAGE_CONCEPTS.map(row => row.id)).size, 125);
assert.equal(new Set(USAGE_ROUNDS.map(round => round.id)).size, 1000);
assert.equal(new Set(USAGE_ROUNDS.map(round => `${round.scene}|${round.sentence}|${round.prompt}`)).size, 1000);
for (const topic of ['work', 'school', 'travel', 'home', 'community']) {
  assert.equal(USAGE_CONCEPTS.filter(row => row.topic === topic).length, 25);
}
for (const concept of USAGE_CONCEPTS) {
  assert.ok(concept.scene.length > 55 && concept.meaning.length > 14, `${concept.id} includes a substantive original situation and explanation`);
  const variants = USAGE_ROUNDS.filter(round => round.conceptId === concept.id);
  assert.equal(variants.length, 8);
  assert.equal(variants.filter(round => round.id.endsWith('-phrase')).length, 4);
  assert.equal(variants.filter(round => round.id.endsWith('-meaning')).length, 4);
  for (const round of variants) {
    assert.equal(round.options.length, 4);
    assert.equal(new Set(round.options).size, 4, `${round.id} has distinct alternatives`);
    assert.ok(round.options.includes(round.answer));
    assert.ok(round.explanation.includes(concept.phrase));
  }
}
assert.equal(CONVERSATION_ROUNDS.length, 1000);
assert.equal(new Set(CONVERSATION_ROUNDS.map(round => round.id)).size, 1000);
assert.equal(new Set([...USAGE_ROUNDS, ...CONVERSATION_ROUNDS].map(round => round.id)).size, 2000);
assert.equal(new Set(CONVERSATION_ROUNDS.map(round => `${round.scene}|${round.sentence}|${round.prompt}`)).size, 1000);
for (const concept of USAGE_CONCEPTS) {
  const tasks = CONVERSATION_ROUNDS.filter(round => round.conceptId === concept.id);
  assert.deepEqual(tasks.map(round => round.stage), [0, 0, 1, 1, 2, 2, 3, 3]);
  for (const round of tasks) {
    assert.ok(round.explanation.includes(concept.phrase));
    if (round.stage < 3) {
      assert.equal(round.options.length, 4);
      assert.equal(new Set(round.options).size, 4);
      assert.ok(round.options.includes(round.answer));
    } else {
      assert.equal(round.type, 'recall');
      assert.equal(round.answer, concept.phrase);
      assert.ok(round.clue.length > 15);
    }
  }
}
const standalone = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const embedded = standalone.match(/const ROWS = `([\s\S]*?)`\.trim\(\)\.split\('\\n'\)/)?.[1];
const moduleRows = readFileSync(new URL('../supabase-app/js/usage-data.js', import.meta.url), 'utf8').match(/const ROWS = `([\s\S]*?)`\.trim\(\)\.split\('\\n'\)/)?.[1];
assert.ok(embedded && moduleRows);
assert.equal(embedded.trim().replace(/^\s+/gm, ''), moduleRows.trim().replace(/^\s+/gm, ''), 'Standalone and modular builds use identical curated source rows');
console.log('Usage Studio smoke tests passed: 125 curated expressions, 2000 distinct stable tasks, answer integrity, and synchronized builds.');
