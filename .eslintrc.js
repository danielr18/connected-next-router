module.exports = {
  parser: "babel-eslint",
  env: {
    browser: true,
    node: true
  },
  plugins: ["import", "react"],
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:react/recommended"
  ],
  rules: {
    "max-len": ["error", { code: 120 }],
    quotes: [2, "single", "avoid-escape"],
    semi: [2, "never"]
  }
};
