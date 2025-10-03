# Take-Home Task: **Web3 Message Signer & Verifier**
React + Dynamic.xyz Headless Implementation (Frontend) | Node.js + Express (Backend)

## 🎯 Objective
Build a full-stack Web3 app that allows a user to:
1. Authenticate using a **Dynamic.xyz embedded wallet headless implementation https://docs.dynamic.xyz/headless/headless-email** ⚠️ Do not simply implement the Widget ⚠️
2. Enter and **sign a custom message** of the user's choosing
3. Send the signed message to a **Node.js + Express** backend
4. Backend verifies the signature and responds with validity + address

## 🚀 Implementation Details

This project has been implemented as a monorepo using pnpm workspaces, with the following structure:

```
/
├── frontend/                 # React frontend application
├── backend/                  # Node.js + Express backend
├── packages/
│   └── shared/               # Shared types and utilities
├── pnpm-workspace.yaml       # Workspace configuration
└── package.json              # Root package.json with scripts
```

### 🔧 Setup Instructions

#### Prerequisites

- Node.js (v14 or higher)
- pnpm (v7 or higher) - Install with `npm install -g pnpm`
- Dynamic.xyz account and environment ID

#### Quick Start

1. Run the setup script:
   ```bash
   ./setup.sh
   ```

2. Start development servers:
   ```bash
   ./dev.sh
   ```

   Or use pnpm directly:
   ```bash
   # Install dependencies
   pnpm install

   # Build shared package
   pnpm --filter @web3-message-signer/shared build

   # Start both servers
   pnpm dev
   ```

3. Access the application:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001

### 🧩 Frontend (React 18+)
* Integrates Dynamic.xyz Embedded Wallet with headless email authentication
* After authentication:
   * Shows connected wallet address
   * Provides a form to input a custom message
   * Lets user sign the message
   * Submits `{ message, signature }` to backend
* Shows result from backend:
   * Whether the signature is valid
   * Which wallet signed it
* Allows signing multiple messages with local history storage

### 🌐 Backend (Node.js + Express)
* Creates a REST API endpoint: `POST /verify-signature`
* Accepts:
```json
{ "message": "string", "signature": "string" }
```
* Uses `ethers.js` to:
   * Recover the signer from the signature
   * Validate the signature
* Returns:
```json
{ "isValid": true, "signer": "0xabc123...", "originalMessage": "..." }
```

## 🔄 Trade-offs and Future Improvements

1. **TypeScript Integration**: The monorepo structure ensures type safety across packages, but requires proper build steps.

2. **Authentication Security**: The current implementation uses a simplified authentication flow. In a production environment, you would want to implement proper session management and security measures.

3. **Error Handling**: The error handling could be improved with more specific error messages and better user feedback.

4. **Testing Coverage**: While basic tests are included, a production application would benefit from more comprehensive test coverage.

5. **Multi-Factor Authentication**: As mentioned in the requirements, implementing MFA would enhance security (not implemented in this version).

## 📝 Development Commands

```bash
# Install dependencies
pnpm install

# Start development servers
pnpm dev

# Build all packages
pnpm build

# Run tests
pnpm test

# Clean up
pnpm clean
```

## ✅ Evaluation Focus
| Area | Implementation |
|------|-------------|
| **React architecture** | Used modern React patterns with hooks, context, and TypeScript |
| **Dynamic.xyz usage** | Implemented headless authentication flow with email |
| **Node.js + Express** | Created modular REST API with proper signature validation |
| **Code quality** | Used TypeScript throughout with proper error handling |
| **User experience** | Designed responsive UI with clear feedback and intuitive flow |
| **Extensibility** | Monorepo structure allows for easy extension and code sharing |
| **Design** | Modern UI with responsive design and clear user feedback |
