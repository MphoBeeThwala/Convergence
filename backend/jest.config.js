module.exports = {
  testMatch: ["**/*.test.js"],
  testEnvironment: "node",
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov"],
  setupFilesAfterEnv: [],
  testTimeout: 10000
};
