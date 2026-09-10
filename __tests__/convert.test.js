const { celsiusToFahrenheit, fahrenheitToCelsius } = require('../src/convert');

describe('Convert Logic', () => {
  describe('celsiusToFahrenheit — ✅ passing tests', () => {
    test('0°C = 32°F', () => {
      expect(celsiusToFahrenheit(0)).toBe(32);
    });
    test('100°C = 212°F', () => {
      expect(celsiusToFahrenheit(100)).toBe(212);
    });
    test('-40°C = -40°F', () => {
      expect(celsiusToFahrenheit(-40)).toBe(-40);
    });
    test('37°C ≈ 98.6°F', () => {
      expect(celsiusToFahrenheit(37)).toBeCloseTo(98.6, 5);
    });
    test('string "25" should coerce to 25', () => {
      expect(celsiusToFahrenheit('25')).toBeCloseTo(77, 5);
    });
  });

  describe('fahrenheitToCelsius — ✅ passing tests', () => {
    test('32°F = 0°C', () => {
      expect(fahrenheitToCelsius(32)).toBe(0);
    });
    test('212°F = 100°C', () => {
      expect(fahrenheitToCelsius(212)).toBe(100);
    });
  });

  describe('❌ intentionally failing tests (for CI coverage demonstration)', () => {
    test('BUG: fahrenheitToCelsius("") throws', () => {
      expect(() => fahrenheitToCelsius('')).toThrow();
    });

    test('BUG: rounding issue when input is exactly "-0"', () => {
      const result = celsiusToFahrenheit(-0);
      expect(result).not.toBe(-0);
    });

    test('BUG: "abc" produces NaN but message is unclear', () => {
      const result = celsiusToFahrenheit('abc');
      expect(result).toBe('not a number');
    });
  });
});
