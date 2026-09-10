module.exports = {
  celsiusToFahrenheit: (c) => {
    if (c === null || c === undefined || c === '') return NaN;
    const num = Number(c);
    if (Number.isNaN(num)) return NaN;
    return Math.round(((num * 9) / 5 + 32) * 100) / 100;
  },
  fahrenheitToCelsius: (f) => {
    if (f === null || f === undefined || f === '') return NaN;
    const num = Number(f);
    if (Number.isNaN(num)) return NaN;
    return Math.round((((num - 32) * 5) / 9) * 100) / 100;
  },
};