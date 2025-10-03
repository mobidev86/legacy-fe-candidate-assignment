# Web3 Message Signer & Verifier - Backend

This is the backend part of the Web3 Message Signer & Verifier application. It's built with Node.js, Express, and TypeScript, and provides an API for verifying Ethereum signatures.

## 🚀 Features

- **Signature Verification** - Verify Ethereum signatures using ethers.js
- **REST API** - Simple and clean REST API
- **TypeScript** - Type-safe code

## 🔧 Setup

### Prerequisites

- Node.js (v14 or higher)
- pnpm (v7 or higher)

### Environment Variables

Copy `.env.example` to `.env` and update if needed:

```
PORT=3001
CORS_ORIGIN=http://localhost:3000
```

### Available Scripts

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Run tests
pnpm test

# Clean up
pnpm clean
```

## 📁 Project Structure

```
/
├── controllers/       # Request handlers
├── routes/            # API routes
├── utils/             # Utility functions
└── index.ts           # Entry point
```

## 🔄 API Endpoints

### POST /verify-signature

Verifies an Ethereum signature.

**Request:**
```json
{
  "message": "string",
  "signature": "string"
}
```

**Response:**
```json
{
  "isValid": true,
  "signer": "0xabc123...",
  "originalMessage": "..."
}
```

## 🧪 Testing

The backend includes unit tests for the signature verification logic. Run the tests with:

```bash
pnpm test
```
