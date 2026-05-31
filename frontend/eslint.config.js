import pluginVue from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'

export default [
  // 忽略文件
  {
    ignores: ['dist/**', 'node_modules/**', '*.min.js'],
  },

  // Vue 3 recommended 规则（flat config，展开数组）
  ...pluginVue.configs['flat/recommended'],

  // Vue 文件特殊配置
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        ecmaFeatures: { jsx: false },
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      // 放宽部分规则，方便开发
      'vue/multi-word-component-names': 'off',
      'vue/no-v-html': 'warn',
      'vue/require-default-prop': 'off',
      'vue/require-prop-types': 'off',
      'no-unused-vars': 'warn',
    },
  },

  // JS 文件配置
  {
    files: ['**/*.js', '**/*.mjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      'no-console': 'warn',
      'no-debugger': 'warn',
      'no-unused-vars': 'warn',
    },
  },
]
