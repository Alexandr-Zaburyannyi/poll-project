/** @format */

module.exports = {
  testEnvironment: 'node',

  testMatch: ['**/tests/**/*.test.js'],

  testPathIgnorePatterns: ['/node_modules/'],

  verbose: true,

  clearMocks: true,

  collectCoverage: true,

  coverageDirectory: 'coverage',

  collectCoverageFrom: ['src/services/*.js'],

  coverageThreshold: {
    global: {
      branches: 50,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
};
