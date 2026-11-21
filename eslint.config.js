const js = require("@eslint/js");
const globals = require("globals");

module.exports = [
  {
    ignores: [
      "_site/**",
      "vendor/**",
      "node_modules/**",
      ".cache/**",
      "lib/**",
      "foo.html",
    ],
  },
  js.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "commonjs",
      globals: {
        ...globals.node,
        createRecruiterController: "readonly",
      },
    },
  },
];
