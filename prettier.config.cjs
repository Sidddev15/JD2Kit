/** @type {import("prettier").Config} */
module.exports = {
  semi: true,
  singleQuote: false,
  trailingComma: "all",
  printWidth: 100,
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require("prettier-plugin-tailwindcss")],
};
