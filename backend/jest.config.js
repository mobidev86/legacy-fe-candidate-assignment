/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    // Map the shared package to its source files for testing
    '@web3-message-signer/shared': '<rootDir>/../packages/shared/src/index.ts'
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: '<rootDir>/tsconfig.json',
    }],
  },
};
