import antfu from '@antfu/eslint-config'

export default antfu(
  {
    formatters: true,
    typescript: true,
    vue: true,
    stylistic: true,
    ignores: ['.gitignore'],
  },
)
