const { defineConfig } = require("eslint/config");

const prettierConfig = require("eslint-config-prettier");
const typescriptParser = require("@typescript-eslint/parser");

// ESLint 전체 설정 구성
module.exports = defineConfig([
  {
    files: ["**/*.ts"], // 적용할 파일(glob 패턴)을 지정
    ignores: ["**/node_modules/**", "**/dist/**", "**/build**", "audit-ci.jsonc"], // 린트에서 제외할 파일(또는 폴더)을 지정

    // 언어 해석 방식 지정
    languageOptions: {
      parser: typescriptParser,
      // parser: require.resolve("@typescript-eslint/parser"), // 타입스크립트 해석기 등록
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
        project: "./tsconfig.json",
      },
      globals: {
        __DEV__: "readonly",
        global: "readonly",
      },
    },

    // 추가적으로 코드 품질을 검사할 플러그인 추가
    plugins: {
      "@typescript-eslint": require("@typescript-eslint/eslint-plugin"),
      import: require("eslint-plugin-import"),
      prettier: require("eslint-plugin-prettier"), // Prettier 포맷팅 규칙도 코드 품질 검사에 추가시킨다.
    },

    // 적용할 린트 규칙을 설정
    rules: {
      "import/no-named-as-default": "off",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",

      // ⚠️ 경고 수준 Lint Rules
      "for-direction": "warn",
      "no-async-promise-executor": "warn",
      "no-compare-neg-zero": "warn",
      "no-constant-condition": "warn",
      "no-empty-pattern": "warn",
      "no-self-assign": "warn",
      "no-unsafe-finally": "warn",
      "no-console": "warn",
      "no-debugger": "warn",

      // ❌ 오류 수준 Lint Rules
      "constructor-super": "error",
      "getter-return": "error",
      "no-class-assign": "error",
      "no-const-assign": "error",
      "no-dupe-args": "error",
      "no-dupe-class-members": "error",
      "no-dupe-keys": "error",
      "no-duplicate-case": "error",
      "no-ex-assign": "error",
      "no-func-assign": "error",
      "no-import-assign": "error",
      "no-new-native-nonconstructor": "error",
      "no-obj-calls": "error",
      "no-this-before-super": "error",
      "no-unreachable": "error",
      "use-isnan": "error",
      "valid-typeof": "error",
      "@typescript-eslint/no-explicit-any": "error",
    },
  },

  prettierConfig, // Prettier 비활성화
]);
