# Web3 Message Signer & Verifier - Shared Package

This package contains shared types and utilities used by both the frontend and backend of the Web3 Message Signer & Verifier application.

## 🚀 Features

- **Shared Types** - TypeScript interfaces shared between frontend and backend
- **Type Safety** - Ensures consistency across packages

## 🔧 Usage

This package is used internally by the Web3 Message Signer & Verifier monorepo and is not published to npm.

### Building

```bash
pnpm build
```

### Available Types

- `SignedMessage` - Interface for a signed message
- `VerificationRequest` - Interface for a signature verification request
- `VerificationResponse` - Interface for a signature verification response

## 📁 Project Structure

```
/
├── src/               # Source files
│   └── index.ts       # Main entry point and type definitions
├── dist/              # Compiled output (generated)
├── tsconfig.json      # TypeScript configuration
└── package.json       # Package configuration
```
