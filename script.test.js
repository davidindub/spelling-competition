const script = require('./public/script');
const checkWordLength = script.checkWordLength;


test('abcd is sufficient length (4)', () => {
  expect(checkWordLength("4444")).toBe(true);
});

test('abc is not sufficient length (3)', () => {
  expect(checkWordLength("333")).toBe(false);
});

