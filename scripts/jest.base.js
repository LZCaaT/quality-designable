const path = require('path')
module.exports = {
  collectCoverage: true,
  verbose: true,
  testEnvironment: 'jsdom',
  testMatch: ['**/__tests__/**/*.spec.[jt]s?(x)'],
  setupFilesAfterEnv: [
    require.resolve('@testing-library/jest-dom'),
    path.resolve(__dirname, './global.ts'),
  ],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        diagnostics: false,
        tsconfig: 'tsconfig.jest.json',
      },
    ],
  },
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/__tests__/',
    '/esm/',
    '/lib/',
    'package.json',
    '/demo/',
    '/packages/builder/src/__tests__/',
    '/packages/builder/src/components/',
    '/packages/builder/src/configs/',
    'package-lock.json',
  ],
}
