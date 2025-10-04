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
   - Copy the example environment file:
     ```bash
     cp packages/frontend/.env.example packages/frontend/.env
     ```
   - Edit `packages/frontend/.env` and replace `DYNAMIC_ENVIRONMENT_ID` with your actual Dynamic.xyz environment ID:
     ```
     VITE_API_URL=http://localhost:4000
     VITE_DYNAMIC_ENVIRONMENT_ID=your-actual-dynamic-environment-id-here
     ```

   **Backend**:
   - Create a `.env` file in `packages/backend` if it doesn't exist
   - Add the following:
     ```
     PORT=4000
     NODE_ENV=development
     ```

   **Security Note**: Never commit the `.env` file to version control. The `.env.example` file serves as a template with placeholder values.

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

### Missing Environment Variables

If you see an error like "VITE_DYNAMIC_ENVIRONMENT_ID is not set in environment variables":

1. Ensure you've created the `.env` file in `packages/frontend/`
2. Verify the file contains `VITE_DYNAMIC_ENVIRONMENT_ID=your-actual-id`
3. Restart the development server after creating/modifying the `.env` file
4. Make sure the environment variable name starts with `VITE_` (required by Vite)

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

### "Cannot read properties of undefined (reading 'toString')" Error

If you encounter this specific error, it's likely due to one of the following issues:

1. **Dynamic.xyz Environment ID**: The environment ID might be undefined or not properly converted to a string. We've fixed this by using hardcoded string literals instead of environment variables.

2. **Wallet Address Handling**: When trying to display or manipulate wallet addresses that might be undefined. We've added defensive code to check for undefined values before calling methods like `toString()` or `substring()`.

3. **API Response Handling**: When processing verification responses that might have unexpected formats. We've added validation and fallback values for all API responses.

4. **Component Initialization**: Components trying to access properties before they're fully initialized. We've added loading states and proper initialization checks.

#### Latest Fixes (More Aggressive Approach)

If you're still experiencing the error after the initial fixes, we've implemented more aggressive solutions:

1. **Fallback Context System**: We've created a fallback mechanism that will render the app even if the Dynamic.xyz SDK fails to initialize properly.

2. **Hardcoded Values**: We've completely eliminated the use of environment variables and dynamic values in critical parts of the code, using string literals instead.

3. **SDK Detection**: We now check if the Dynamic.xyz SDK is properly loaded in the window object before attempting to use it.

4. **String Concatenation**: We've replaced `toString()` calls with string concatenation (`'' + value`) which is more forgiving with undefined values.

5. **IIFE for Complex Logic**: We've wrapped complex logic in Immediately Invoked Function Expressions (IIFEs) to isolate and handle errors more effectively.

### "useDynamicContext must be used within a DynamicContextProvider" Error

If you encounter this error, it means components are trying to use the Dynamic.xyz context hook outside of its provider. We've implemented a comprehensive solution:

1. **Mock Context Provider**: We've created a mock implementation of the Dynamic.xyz context that provides the same API surface but works without the actual SDK.

2. **Safe Context Hook**: We've implemented a `useSafeDynamicContext` hook that automatically falls back to the mock implementation if the real one fails.

3. **Graceful Degradation**: The application now works in fallback mode with mock wallet functionality when the Dynamic.xyz SDK isn't available or fails to initialize.

4. **Visual Indicator**: A yellow notification bar appears when running in fallback mode so users are aware of the limited functionality.

This approach ensures the application remains functional even when there are issues with the Dynamic.xyz SDK integration.

The fixes include:

- Explicit type checking with `typeof` before calling methods
- Using string literals and concatenation instead of `toString()`
- Adding try-catch blocks around potentially problematic code
- Providing fallback values for undefined properties
- Creating fallback UI components that work without the Dynamic.xyz SDK
