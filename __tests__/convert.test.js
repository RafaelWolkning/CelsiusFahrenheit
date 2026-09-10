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
    test('negative zero -0 is handled', () => {
      expect(celsiusToFahrenheit(-0)).toBe(32);
    });
  });

  describe('fahrenheitToCelsius — ✅ passing tests', () => {
    test('32°F = 0°C', () => {
      expect(fahrenheitToCelsius(32)).toBe(0);
    });
    test('212°F = 100°C', () => {
      expect(fahrenheitToCelsius(212)).toBe(100);
    });
    test('string "32" should coerce to 32', () => {
      expect(fahrenheitToCelsius('32')).toBe(0);
    });
    test('68°F = 20°C (fractional)', () => {
      expect(fahrenheitToCelsius(68)).toBe(20);
    });
  });

  describe('Edge cases — invalid inputs return NaN', () => {
    test('empty string returns NaN', () => {
      expect(fahrenheitToCelsius('')).toBeNaN();
    });
    test('non-numeric string returns NaN', () => {
      expect(celsiusToFahrenheit('abc')).toBeNaN();
    });
    test('null returns NaN', () => {
      expect(fahrenheitToCelsius(null)).toBeNaN();
    });
    test('undefined returns NaN', () => {
      expect(celsiusToFahrenheit(undefined)).toBeNaN();
    });
  });
});