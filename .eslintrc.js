module.exports = {
    extends: ['wesbos'],
    rules: {
      'no-param-reassign': 0,
      'react/display-name': 'off',
      'no-unused-expressions': 0,
      'global-require' : 0,
      'import/no-dynamic-require': 0,
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
          'newlines-between': 'always',
        },
      ],
    },
  }
  