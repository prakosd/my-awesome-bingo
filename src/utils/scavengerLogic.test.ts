import { generateChecklist } from './bingoLogic';
import { questions, FREE_SPACE } from '../data/questions';

describe('generateChecklist', () => {
  it('returns exactly 24 items', () => {
    const checklist = generateChecklist();
    expect(checklist).toHaveLength(24);
  });

  it('each item has isChecked: false', () => {
    const checklist = generateChecklist();
    checklist.forEach((item) => {
      expect(item.isChecked).toBe(false);
    });
  });

  it('each item has a unique sequential id from 0 to 23', () => {
    const checklist = generateChecklist();
    const ids = checklist.map((item) => item.id).sort((a, b) => a - b);
    expect(ids).toEqual(Array.from({ length: 24 }, (_, i) => i));
  });

  it('no item has text equal to FREE_SPACE constant', () => {
    const checklist = generateChecklist();
    checklist.forEach((item) => {
      expect(item.text).not.toBe(FREE_SPACE);
    });
  });

  it('all question texts from the questions array are included', () => {
    const checklist = generateChecklist();
    const texts = checklist.map((item) => item.text);
    questions.forEach((question) => {
      expect(texts).toContain(question);
    });
  });

  it('returns items in different order on repeated calls (shuffle test — run 5 times, at least one must differ)', () => {
    const orders = Array.from({ length: 5 }, () =>
      generateChecklist().map((item) => item.text)
    );
    const first = orders[0];
    const allSame = orders.every(
      (order) => order.join('|') === first.join('|')
    );
    expect(allSame).toBe(false);
  });

  it('does not mutate the original questions array', () => {
    const originalQuestions = [...questions];
    generateChecklist();
    expect(questions).toEqual(originalQuestions);
  });
});
