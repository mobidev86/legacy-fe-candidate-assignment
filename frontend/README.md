# Web3 Message Signer & Verifier - Frontend

This is the frontend part of the Web3 Message Signer & Verifier application. It's built with React and TypeScript, and integrates with Dynamic.xyz for wallet authentication.

## Features

- **Dynamic.xyz Headless Wallet Integration** - Email-based authentication
- **Message Signing** - Sign custom messages with your connected wallet
- **Signature Verification** - Verify signatures using the backend API
- **Message History** - Local storage of signed messages
- **Responsive UI** - Modern, responsive design

## Setup

### Prerequisites

- Node.js (v14 or higher)
- pnpm (v7 or higher)

### Environment Variables

Copy `.env.example` to `.env` and update with your Dynamic.xyz environment ID:

```
REACT_APP_DYNAMIC_ENVIRONMENT_ID=your-environment-id-here
REACT_APP_API_URL=http://localhost:3001
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

## Project Structure

```
/
├── components/       # React components
├── contexts/         # React contexts
├── services/         # API services
├── types/            # TypeScript type definitions
└── utils/            # Utility functions
```

## Integration with Backend

The frontend communicates with the backend API to verify signatures. The API endpoint is configured in the `.env` file.
