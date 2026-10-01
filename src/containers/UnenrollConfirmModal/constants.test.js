import constants, { order, reasonKeys } from './constants';

describe('UnenrollConfirmModal constants', () => {
  it('lists the survey options in the intended order', () => {
    expect(order.map((key) => constants.messages[key].defaultMessage)).toEqual([
      'I needed to unenroll from a 0%-completion class to register for new classes',
      "I don't have the time",
      "I just wanted to browse the material (but I didn't know I don't need to enroll to browse, but I do now!)",
      'Something was broken',
      'The course material was too easy',
      'The course material was too hard',
      "This course isn't aligned with my goals",
      "I don't have enough support",
    ]);
  });
  it('gives every ordered option a message, once, and keeps custom out of the list', () => {
    expect(new Set(order).size).toEqual(order.length);
    order.forEach((key) => expect(constants.messages[key]).toBeDefined());
    expect(order).not.toContain(reasonKeys.custom);
  });
  it('has no leftover keys for options that were removed', () => {
    expect(Object.keys(reasonKeys).sort()).toEqual([...order, reasonKeys.custom].sort());
  });
});
