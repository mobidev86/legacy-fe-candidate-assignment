# Web3 Message Signer & Verifier - Solution

This project implements a full-stack Web3 application that allows users to authenticate using Dynamic.xyz's headless wallet implementation, sign custom messages, and verify signatures using a Node.js backend.

## 🚀 Features

- **Dynamic.xyz Headless Wallet Integration** - Email-based authentication
- **Message Signing** - Sign custom messages with your connected wallet
- **Signature Verification** - Backend verification of signatures using ethers.js
- **Message History** - Local storage of signed messages
- **Responsive UI** - Modern, responsive design

## 📁 Project Structure

```
/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── contexts/         # React contexts
│   │   ├── services/         # API services
│   │   ├── types/            # TypeScript type definitions
│   │   └── ...
│   └── ...
├── backend/                  # Node.js + Express backend
│   ├── src/
│   │   ├── controllers/      # Request handlers
│   │   ├── routes/           # API routes
│   │   ├── utils/            # Utility functions
│   │   └── index.ts          # Entry point
│   └── ...
└── README.md                 # Project documentation
```

## 🔧 Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Dynamic.xyz account and environment ID

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the TypeScript code:
   ```bash
   npm run build
   ```

4. Start the server:
   ```bash
   npm start
   ```

   For development with hot-reloading:
   ```bash
   npm run dev
   ```

5. The backend will be running at `http://localhost:3001`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with your Dynamic.xyz environment ID:
   ```
   REACT_APP_DYNAMIC_ENVIRONMENT_ID=your-environment-id
   REACT_APP_API_URL=http://localhost:3001
   ```

4. Start the development server:
   ```bash
   npm start
   ```

5. The frontend will be running at `http://localhost:3000`

## 🧪 Running Tests

### Backend Tests

```bash
cd backend
npm test
```

### Frontend Tests

```bash
cd frontend
npm test
```

## 🛠️ Implementation Notes

### Dynamic.xyz Integration

The application uses Dynamic.xyz's headless wallet implementation for authentication. In a production environment, you would need to:

1. Create an account at [Dynamic.xyz](https://www.dynamic.xyz/)
2. Set up an environment and get your environment ID
3. Configure the authentication methods (email, social, etc.)

### Message Signing

The application uses the connected wallet to sign messages. The signature is then sent to the backend for verification.

### Signature Verification

The backend uses ethers.js to verify signatures by:
1. Hashing the original message
2. Recovering the signer address from the signature
3. Comparing the recovered address with the expected signer

### Local Storage

Signed messages are stored in the browser's localStorage to persist across sessions.

## 🔄 Trade-offs and Future Improvements

1. **Authentication Security**: The current implementation uses a simplified authentication flow. In a production environment, you would want to implement proper session management and security measures.

2. **Error Handling**: The error handling could be improved with more specific error messages and better user feedback.

3. **Testing Coverage**: While basic tests are included, a production application would benefit from more comprehensive test coverage.

4. **Multi-Factor Authentication**: As mentioned in the requirements, implementing MFA would enhance security.

5. **Network Support**: Currently only supports Ethereum mainnet. Could be extended to support multiple networks.

6. **Deployment**: The application could be deployed to a cloud provider like Vercel (frontend) and Render (backend).

## 📝 License

This project is licensed under the MIT License.
