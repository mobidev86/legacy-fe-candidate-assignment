/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    // Map the shared package to its source files for testing
    '@web3-message-signer/shared': '<rootDir>/../packages/shared/src/index.ts',
    // Handle CSS imports (if needed)
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: '<rootDir>/tsconfig.json',
    }],
  },
  setupFilesAfterEnv: [
    '<rootDir>/src/setupTests.ts'
  ],
};
