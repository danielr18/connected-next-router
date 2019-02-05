module.exports = {
  parser: "babel-eslint",
  env: {
    browser: true,
    node: true
  },
  plugins: ["import", "react"],
  settings: {
    'import/resolver': {
      node: {
        moduleDirectory: ['node_modules', __dirname],
      },
    },
    react: {
      version: '16.6',
    },
  },
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
