export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Allow these types from your repo rules
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'build',
        'ci',
        'chore',
        'revert',
      ],
    ],
    // Ensure subject case is lowercase (conventional commits standard)
    'subject-case': [
      2,
      'never',
      ['sentence-case', 'start-case', 'pascal-case', 'upper-case'],
    ],
    // Limit subject line length
    'subject-max-length': [2, 'always', 72],
    // Ensure subject is not empty
    'subject-empty': [2, 'never'],
    // Ensure type is not empty
    'type-empty': [2, 'never'],
    // Allow scope to be optional
    'scope-empty': [0, 'never'],
  },
};
