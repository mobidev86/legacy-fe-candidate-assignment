# Web3 Message Signer & Verifier - Setup Instructions

This project is a monorepo using pnpm workspaces, with a React frontend and Node.js/Express backend.

## Prerequisites

- Node.js (v16+)
- pnpm (v10+)
- A Dynamic.xyz account for the environment ID

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd web3-message-signer-verifier
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:

   **Frontend**:
   - Open `packages/frontend/src/App.tsx`
   - Replace `REPLACE_WITH_YOUR_DYNAMIC_ENVIRONMENT_ID` with your actual Dynamic.xyz environment ID

   **Backend**:
   - Create a `.env` file in `packages/backend` if it doesn't exist
   - Add the following:
     ```
     PORT=4000
     NODE_ENV=development
     ```

## Development

Run both frontend and backend in development mode:

```bash
pnpm dev
```

This will start:
- Frontend: http://localhost:3000
- Backend: http://localhost:4000

### Running separately

**Frontend only**:
```bash
pnpm --filter frontend dev
```

**Backend only**:
```bash
pnpm --filter backend dev
```

## Building for Production

Build both packages:

```bash
pnpm build
```

## Production Deployment

Start the backend server:

```bash
pnpm start
```

For the frontend, you can serve the built files from the `packages/frontend/dist` directory using any static file server.

## Project Structure

```
/
├── packages/
│   ├── frontend/           # React frontend with Vite and Tailwind CSS
│   │   ├── src/
│   │   │   ├── components/ # React components
│   │   │   ├── pages/      # Page components
│   │   │   ├── services/   # API services
│   │   │   └── types/      # TypeScript type definitions
│   │   └── ...
│   │
│   └── backend/            # Node.js/Express backend
│       ├── src/
│       │   ├── controllers/ # Request handlers
│       │   ├── routes/      # API routes
│       │   └── utils/       # Utility functions
│       └── ...
└── ...
```

## Features

- **Authentication**: Uses Dynamic.xyz's headless wallet implementation
- **Message Signing**: Sign custom messages with your Ethereum wallet
- **Signature Verification**: Backend verifies signatures using ethers.js
- **Message History**: Locally stored history of signed messages

## Notes on Implementation

- The frontend uses React 18 with TypeScript and Tailwind CSS for styling
- Dynamic.xyz is used for wallet authentication
- The backend uses ethers.js for signature verification
- Message history is stored in localStorage
- The application is set up as a monorepo using pnpm workspaces

## Troubleshooting

### UI Flickering Issues

If you experience UI flickering where components briefly appear and then disappear, this may be due to initialization issues with the Dynamic.xyz SDK. The following fixes have been implemented:

1. Added loading states with timeouts to ensure components are fully mounted before rendering
2. Wrapped components in ErrorBoundary to catch and display any runtime errors
3. Added try-catch blocks around Dynamic.xyz SDK method calls
4. Updated TypeScript configuration for better module resolution

If issues persist:

- Check browser console for errors
- Ensure you're using the correct Dynamic.xyz environment ID
- Try clearing localStorage and browser cache
- Verify that the backend server is running and accessible
