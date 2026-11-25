// Fichier de la formation : ne pas modifier.
'use strict';

module.exports = [
  { ignores: ['**/node_modules/', '**/vendor/', '**/test-results/', '**/playwright-report/'] },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'commonjs',
      globals: {
        require: 'readonly',
        module: 'writable',
        exports: 'writable',
        __dirname: 'readonly',
        __filename: 'readonly',
        process: 'readonly',
        console: 'readonly',
      },
    },
    rules: {
      complexity: ['warn', 10],
    },
  },
];
