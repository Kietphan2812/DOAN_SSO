module.exports = {
  testEnvironment: 'node',
  verbose: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'server/**/*.js',
    '!**/node_modules/**'
  ],
  coverageReporters: ['text', 'lcov', 'html', 'text-summary'],
  testMatch: ['**/tests/**/*.test.js'],
  testTimeout: 10000
};
