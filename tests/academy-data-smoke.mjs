import assert from 'node:assert/strict';
import { ACADEMY_CONTENT } from '../supabase-app/js/academy-data.js';

const grades = Object.keys(ACADEMY_CONTENT.grades).map(Number).sort((a, b) => a - b);
assert.deepEqual(grades, [6, 7, 8, 9, 10], 'First release covers only the five agreed grades');
assert.ok(ACADEMY_CONTENT.sources.ssc2026.startsWith('https://nctb.gov.bd/'));
for (const gradeNumber of grades) {
  const grade = ACADEMY_CONTENT.grades[gradeNumber];
  const writing = ACADEMY_CONTENT.writing.filter(entry => entry.grade === gradeNumber);
  const ids = new Set(writing.map(entry => entry.id));
  const types = new Set(writing.map(entry => entry.type));

  assert.ok(grade.books.includes('English for Today'), `Class ${gradeNumber} names English for Today`);
  assert.ok(grade.books.includes('English Grammar and Composition'), `Class ${gradeNumber} names English Grammar and Composition`);
  assert.ok(grade.units.length > 0 && grade.tests.length > 0, `Class ${gradeNumber} has curriculum and practice content`);
  for (const type of ['paragraph', 'dialogue', 'composition', 'story']) {
    assert.ok(types.has(type), `Class ${gradeNumber} includes a ${type} model`);
  }
  assert.ok(writing.every(entry => entry.title && entry.prompt && entry.modelAnswer && entry.banglaNote), `Class ${gradeNumber} model answers include concise Bangla support`);

  for (const test of grade.tests) {
    for (const writingId of [
      ...(test.tasks || []).map(task => task.writingId),
      ...(test.writingId ? [test.writingId] : [])
    ].filter(Boolean)) {
      assert.ok(ids.has(writingId), `Class ${gradeNumber} test ${test.id} links to a same-class answer: ${writingId}`);
    }
  }
}

const ssc = ACADEMY_CONTENT.grades[9].tests;
const sscClass10 = ACADEMY_CONTENT.grades[10].tests;
assert.ok(ssc.some(test => test.note.includes('paragraph (10)') && test.note.includes('short composition (20)')));
assert.ok(sscClass10.some(test => test.tasks?.some(task => task.label === 'Question 11 · Letter · 10 marks')));
assert.ok(sscClass10.some(test => test.tasks?.some(task => task.writingId === 'c910-letter-study-tour')));
assert.ok(ACADEMY_CONTENT.sources[6].startsWith('https://nctb.gov.bd/'));
assert.ok(ACADEMY_CONTENT.sources[7].startsWith('https://nctb.gov.bd/'));
assert.ok(ACADEMY_CONTENT.sources[8].startsWith('https://nctb.gov.bd/'));
assert.ok(ACADEMY_CONTENT.sources[9].startsWith('https://nctb.gov.bd/'));
assert.ok(ACADEMY_CONTENT.sources[10].startsWith('https://nctb.gov.bd/'));

console.log('Academy data smoke tests passed: Classes 6–10 coverage, model forms, Bangla guidance, NCTB sources, and same-grade test-answer links.');
