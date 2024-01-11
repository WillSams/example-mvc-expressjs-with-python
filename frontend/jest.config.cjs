module.exports = {
  clearMocks: true,
  testMatch: ['**/specs/**/*.spec.js?(x)'],
  testPathIgnorePatterns: ['/node_modules/'],
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  transformIgnorePatterns: ['/node_modules/'],
};
