# Web3 Message Signer & Verifier - Complete Setup Guide

A full-stack Web3 application that enables users to authenticate using Dynamic.xyz embedded wallet (headless implementation), sign custom messages, and verify signatures on the backend.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Detailed Setup](#detailed-setup)
- [Project Structure](#project-structure)
- [Development](#development)
- [Testing](#testing)
- [Production Deployment](#production-deployment)
- [Trade-offs & Design Decisions](#trade-offs--design-decisions)
- [Areas for Improvement](#areas-for-improvement)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v16.x or higher ([Download](https://nodejs.org/))
- **pnpm**: v8.x or higher ([Installation Guide](https://pnpm.io/installation))
  ```bash
  npm install -g pnpm
  ```
- **Dynamic.xyz Account**: Sign up at [Dynamic.xyz](https://www.dynamic.xyz/) to get your Environment ID

## Quick Start

For the fastest setup, use the provided script:

```bash
# Clone the repository
git clone <repository-url>
cd legacy-fe-candidate-assignment

# Run the automated setup script
chmod +x setup-and-run.sh
./setup-and-run.sh
```

The script will:
1. Install all dependencies
2. Create environment files from templates
3. Prompt you for your Dynamic.xyz Environment ID
4. Start both frontend and backend servers

## Detailed Setup

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd legacy-fe-candidate-assignment

# Install all dependencies (monorepo)
pnpm install
```

### 2. Backend Configuration

The backend requires minimal configuration:

```bash
# Navigate to backend directory
cd packages/backend

# Create .env file (optional - defaults work for local development)
cat > .env << EOF
PORT=4000
NODE_ENV=development
EOF
```

**Backend Environment Variables:**
- `PORT`: Server port (default: 4000)
- `NODE_ENV`: Environment mode (development/production)

### 3. Frontend Configuration

The frontend requires a Dynamic.xyz Environment ID:

```bash
# Navigate to frontend directory
cd packages/frontend

# Copy the example environment file
cp .env.example .env

# Edit .env and add your Dynamic.xyz Environment ID
# You can use any text editor:
nano .env
# or
vim .env
# or
code .env
```

**Update the `.env` file:**
```env
VITE_API_URL=http://localhost:4000
VITE_DYNAMIC_ENVIRONMENT_ID=your-actual-dynamic-environment-id-here
```

**Getting your Dynamic.xyz Environment ID:**
1. Sign up/Login at [Dynamic.xyz Dashboard](https://app.dynamic.xyz/)
2. Create a new project or select an existing one
3. Navigate to **Settings** → **API Keys**
4. Copy your **Environment ID**
5. Paste it into the `.env` file

**Important Notes:**
- All Vite environment variables must be prefixed with `VITE_`
- Never commit `.env` files to version control
- The `.env.example` file serves as a template with placeholder values

### 4. Start Development Servers

From the root directory:

```bash
# Start both frontend and backend concurrently
pnpm dev
```

This will start:
- **Frontend**: http://localhost:3000 (Vite dev server)
- **Backend**: http://localhost:4000 (Express server)

**Alternative - Run Separately:**

```bash
# Terminal 1 - Backend only
pnpm --filter backend dev

# Terminal 2 - Frontend only
pnpm --filter frontend dev
```

## Project Structure

```
legacy-fe-candidate-assignment/
├── packages/
│   ├── frontend/                 # React + TypeScript + Vite
│   │   ├── src/
│   │   │   ├── components/       # Reusable React components
│   │   │   │   ├── AuthButton.tsx
│   │   │   │   ├── ErrorBoundary.tsx
│   │   │   │   ├── Layout.tsx
│   │   │   │   ├── MessageForm.tsx
│   │   │   │   ├── MessageHistory.tsx
│   │   │   │   └── ...
│   │   │   ├── context/          # React Context providers
│   │   │   │   └── DynamicContext.tsx
│   │   │   ├── pages/            # Page components
│   │   │   │   ├── Home.tsx
│   │   │   │   └── Dashboard.tsx
│   │   │   ├── services/         # API service layer
│   │   │   │   └── api.ts
│   │   │   ├── types/            # TypeScript type definitions
│   │   │   │   └── index.ts
│   │   │   ├── App.tsx           # Main App component
│   │   │   └── main.tsx          # Entry point
│   │   ├── .env.example          # Environment template
│   │   ├── package.json
│   │   ├── vite.config.ts        # Vite configuration
│   │   └── tailwind.config.js    # Tailwind CSS config
│   │
│   └── backend/                  # Node.js + Express
│       ├── src/
│       │   ├── controllers/      # Request handlers
│       │   │   └── signatureController.js
│       │   ├── routes/           # API route definitions
│       │   │   └── index.js
│       │   ├── utils/            # Utility functions
│       │   └── index.js          # Server entry point
│       ├── __tests__/            # Test files
│       └── package.json
│
├── .gitignore
├── README.md                     # Original assignment
├── SETUP.md                      # Previous setup guide
├── SETUP_README.md              # This comprehensive guide
├── package.json                  # Root package.json
├── pnpm-workspace.yaml          # pnpm workspace config
└── setup-and-run.sh             # Automated setup script
```

## Development

### Available Scripts

**Root Level (Monorepo):**
```bash
pnpm dev          # Run both frontend and backend in dev mode
pnpm build        # Build both packages for production
pnpm start        # Start backend in production mode
pnpm test         # Run all tests
```

**Frontend Only:**
```bash
pnpm --filter frontend dev       # Start dev server
pnpm --filter frontend build     # Build for production
pnpm --filter frontend preview   # Preview production build
pnpm --filter frontend test      # Run frontend tests
pnpm --filter frontend lint      # Run ESLint
```

**Backend Only:**
```bash
pnpm --filter backend dev        # Start with nodemon (auto-reload)
pnpm --filter backend start      # Start in production mode
pnpm --filter backend test       # Run backend tests
```

### Development Workflow

1. **Start Development Servers:**
   ```bash
   pnpm dev
   ```

2. **Make Changes:**
   - Frontend changes auto-reload via Vite HMR
   - Backend changes auto-reload via nodemon

3. **Test Your Changes:**
   ```bash
   pnpm test
   ```

4. **Build for Production:**
   ```bash
   pnpm build
   ```

## Testing

### Backend Tests

The backend uses **Jest** for testing with comprehensive coverage:

```bash
# Run backend tests
pnpm --filter backend test

# Run with coverage
pnpm --filter backend test:coverage

# Run in watch mode
pnpm --filter backend test:watch
```

**Test Coverage:**
- ✅ Signature verification logic
- ✅ API endpoint validation
- ✅ Error handling
- ✅ Input validation
- ✅ Edge cases (invalid signatures, missing fields)

### Frontend Tests

The frontend uses **Vitest** and **React Testing Library**:

```bash
# Run frontend tests
pnpm --filter frontend test

# Run with UI
pnpm --filter frontend test:ui

# Run with coverage
pnpm --filter frontend test:coverage
```

**Test Coverage:**
- ✅ Component rendering
- ✅ User interactions
- ✅ Authentication flow
- ✅ Message signing workflow
- ✅ API integration
- ✅ Error states

### Running All Tests

From the root directory:

```bash
# Run all tests (frontend + backend)
pnpm test

# Run with coverage report
pnpm test:coverage
```

## Production Deployment

### Building for Production

```bash
# Build both frontend and backend
pnpm build
```

This creates:
- `packages/frontend/dist/` - Static files for frontend
- Backend is ready to run (no build step needed)

### Deployment Options

#### Option 1: Separate Deployment (Recommended)

**Frontend (Static Hosting):**
- **Vercel**: 
  ```bash
  cd packages/frontend
  vercel deploy
  ```
- **Netlify**: Deploy `packages/frontend/dist` folder
- **AWS S3 + CloudFront**: Upload `dist` folder

**Backend (Node.js Hosting):**
- **Render**: Connect GitHub repo, set root to `packages/backend`
- **Railway**: Deploy from `packages/backend`
- **Heroku**: 
  ```bash
  cd packages/backend
  git subtree push --prefix packages/backend heroku main
  ```

#### Option 2: Monorepo Deployment

**Vercel (Full Stack):**
1. Connect GitHub repository
2. Configure build settings:
   - Build Command: `pnpm build`
   - Output Directory: `packages/frontend/dist`
   - Install Command: `pnpm install`

**Environment Variables (Production):**

Frontend:
```
VITE_API_URL=https://your-backend-url.com
VITE_DYNAMIC_ENVIRONMENT_ID=your-production-dynamic-id
```

Backend:
```
PORT=4000
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-url.com
```

### Starting Production Server

```bash
# Start backend in production mode
pnpm start

# Or directly
cd packages/backend
node src/index.js
```

For frontend, serve the `dist` folder with any static file server:
```bash
npx serve packages/frontend/dist
```

## Trade-offs & Design Decisions

### Architecture Decisions

#### 1. **Monorepo Structure with pnpm Workspaces**
- **Decision**: Used pnpm workspaces to manage frontend and backend in a single repository
- **Trade-off**: 
  - ✅ Simplified dependency management and version consistency
  - ✅ Easier local development (single `pnpm dev` command)
  - ✅ Shared tooling and configuration
  - ❌ Slightly more complex deployment (need to handle workspace structure)
  - ❌ Larger repository size

#### 2. **Dynamic.xyz Headless Implementation**
- **Decision**: Implemented headless email authentication instead of using the pre-built widget
- **Trade-off**:
  - ✅ Full control over UI/UX
  - ✅ Custom styling and branding
  - ✅ Better integration with app flow
  - ❌ More complex implementation
  - ❌ Need to handle edge cases manually
  - ❌ Requires fallback mechanisms for SDK failures

#### 3. **localStorage for Message History**
- **Decision**: Used localStorage instead of a database for message history
- **Trade-off**:
  - ✅ No backend storage needed
  - ✅ Instant access, no API calls
  - ✅ Works offline
  - ❌ Limited to single device/browser
  - ❌ Data lost on browser clear
  - ❌ No cross-device sync
  - ❌ Limited storage capacity (~5-10MB)

#### 4. **In-Memory Session State**
- **Decision**: No persistent session storage on backend
- **Trade-off**:
  - ✅ Simpler implementation
  - ✅ No database setup required
  - ✅ Faster response times
  - ❌ Sessions lost on server restart
  - ❌ Not suitable for horizontal scaling
  - ❌ No session history/analytics

#### 5. **ethers.js for Signature Verification**
- **Decision**: Used ethers.js v6 instead of viem or web3.js
- **Trade-off**:
  - ✅ Well-documented and widely adopted
  - ✅ Built-in signature verification utilities
  - ✅ Compatible with Dynamic.xyz
  - ❌ Larger bundle size than viem
  - ❌ Not as modern as viem

#### 6. **Tailwind CSS for Styling**
- **Decision**: Used Tailwind CSS instead of CSS-in-JS or component libraries
- **Trade-off**:
  - ✅ Rapid development with utility classes
  - ✅ Consistent design system
  - ✅ Smaller CSS bundle (purged in production)
  - ✅ No runtime overhead
  - ❌ Verbose className strings
  - ❌ Learning curve for new developers

#### 7. **TypeScript for Frontend, JavaScript for Backend**
- **Decision**: TypeScript on frontend, vanilla JavaScript on backend
- **Trade-off**:
  - ✅ Type safety where complexity is highest (React components)
  - ✅ Faster backend development without type overhead
  - ❌ Inconsistent type safety across stack
  - ❌ Potential runtime errors on backend

### Security Considerations

#### 1. **Client-Side Signature Verification**
- **Decision**: All signature verification happens on the backend
- **Rationale**: Never trust client-side validation for security-critical operations

#### 2. **CORS Configuration**
- **Current**: Open CORS for development
- **Production**: Should restrict to specific origins

#### 3. **Environment Variables**
- **Decision**: Use `.env` files with `.env.example` templates
- **Security**: Never commit actual `.env` files

#### 4. **API Key Exposure**
- **Decision**: Dynamic.xyz Environment ID is exposed in frontend bundle
- **Rationale**: This is expected and safe - it's a public identifier, not a secret

### Performance Optimizations

#### 1. **Code Splitting**
- Vite automatically splits code by routes
- Dynamic imports for heavy components

#### 2. **Caching Strategy**
- Message history cached in localStorage
- No unnecessary API calls for historical data

#### 3. **Error Boundaries**
- Implemented to prevent full app crashes
- Graceful degradation when Dynamic SDK fails

## Areas for Improvement

### High Priority

#### 1. **Database Integration**
```typescript
// Current: localStorage
localStorage.setItem('messages', JSON.stringify(messages));

// Improved: Backend database
await db.messages.create({
  userId: user.id,
  message,
  signature,
  timestamp: new Date()
});
```
- **Why**: Enable cross-device sync, better data persistence, analytics
- **Options**: PostgreSQL, MongoDB, Supabase
- **Effort**: Medium (2-3 days)

#### 2. **Authentication State Persistence**
```typescript
// Current: Session lost on refresh
// Improved: JWT tokens with refresh mechanism
const { accessToken, refreshToken } = await authenticateUser();
localStorage.setItem('refreshToken', refreshToken);
```
- **Why**: Better user experience, maintain sessions across refreshes
- **Effort**: Medium (1-2 days)

#### 3. **Comprehensive Error Handling**
```typescript
// Current: Basic try-catch
// Improved: Centralized error handling with user-friendly messages
class AppError extends Error {
  constructor(message, statusCode, userMessage) {
    super(message);
    this.statusCode = statusCode;
    this.userMessage = userMessage;
  }
}
```
- **Why**: Better debugging, improved user experience
- **Effort**: Low (1 day)

#### 4. **Rate Limiting**
```javascript
// Backend: Add rate limiting middleware
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/verify-signature', limiter);
```
- **Why**: Prevent abuse, protect backend resources
- **Effort**: Low (few hours)

### Medium Priority

#### 5. **Multi-Factor Authentication (MFA)**
- Implement Dynamic.xyz headless MFA
- Add TOTP/SMS verification
- **Effort**: High (3-5 days)

#### 6. **Message Templates**
```typescript
// Add predefined message templates
const templates = [
  { name: 'Login', message: 'Sign in to {appName} at {timestamp}' },
  { name: 'Transaction', message: 'Approve transaction {txId}' },
  { name: 'Custom', message: '' }
];
```
- **Why**: Better UX, common use cases
- **Effort**: Low (1 day)

#### 7. **Signature Export/Import**
```typescript
// Export signatures as JSON/CSV
const exportSignatures = () => {
  const data = JSON.stringify(messages, null, 2);
  downloadFile(data, 'signatures.json');
};
```
- **Why**: Data portability, backup
- **Effort**: Low (few hours)

#### 8. **Backend TypeScript Migration**
```typescript
// Convert backend to TypeScript for type safety
// Add shared types package for frontend/backend
```
- **Why**: Type safety, better IDE support, fewer runtime errors
- **Effort**: Medium (2-3 days)

### Low Priority (Nice to Have)

#### 9. **Real-time Updates**
- WebSocket integration for live signature verification status
- **Effort**: Medium (2-3 days)

#### 10. **Analytics Dashboard**
- Track signature verification metrics
- User activity monitoring
- **Effort**: High (5-7 days)

#### 11. **Mobile Responsiveness Enhancements**
- Better mobile UX for wallet connection
- Touch-optimized interactions
- **Effort**: Low (1-2 days)

#### 12. **Internationalization (i18n)**
- Multi-language support
- **Effort**: Medium (2-3 days)

#### 13. **Dark Mode**
- Theme toggle with system preference detection
- **Effort**: Low (1 day)

#### 14. **Advanced Testing**
- E2E tests with Playwright/Cypress
- Visual regression testing
- Load testing for backend
- **Effort**: High (5-7 days)

### Technical Debt

#### 15. **Fallback Context Cleanup**
- Current implementation has extensive fallback mechanisms for Dynamic SDK
- Should be simplified once SDK integration is stable
- **Effort**: Low (1 day)

#### 16. **Code Documentation**
- Add JSDoc comments to all functions
- Generate API documentation
- **Effort**: Medium (2-3 days)

#### 17. **CI/CD Pipeline**
```yaml
# .github/workflows/ci.yml
name: CI/CD
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: pnpm install
      - run: pnpm test
      - run: pnpm build
```
- **Why**: Automated testing, consistent deployments
- **Effort**: Medium (1-2 days)

## Troubleshooting

### Common Issues

#### 1. **"VITE_DYNAMIC_ENVIRONMENT_ID is not set"**

**Cause**: Missing or incorrect environment variable configuration

**Solution**:
```bash
# Ensure .env file exists in packages/frontend/
cd packages/frontend
ls -la .env

# If missing, copy from example
cp .env.example .env

# Edit and add your Dynamic.xyz Environment ID
nano .env

# Restart the dev server
pnpm dev
```

#### 2. **"Cannot connect to backend" / CORS errors**

**Cause**: Backend not running or CORS misconfiguration

**Solution**:
```bash
# Check if backend is running
curl http://localhost:4000/health

# If not running, start it
pnpm --filter backend dev

# Check CORS settings in packages/backend/src/index.js
# Ensure cors() middleware is properly configured
```

#### 3. **"showAuthFlow is not a function"**

**Cause**: Dynamic SDK initialization issue

**Solution**:
- Verify your Dynamic.xyz Environment ID is correct
- Check browser console for SDK loading errors
- The app has fallback mechanisms that should handle this
- Try clearing browser cache and localStorage

#### 4. **Tests failing**

**Cause**: Missing dependencies or environment setup

**Solution**:
```bash
# Reinstall dependencies
pnpm install

# Clear pnpm cache
pnpm store prune

# Run tests with verbose output
pnpm test -- --verbose
```

#### 5. **Build errors**

**Cause**: TypeScript errors or missing dependencies

**Solution**:
```bash
# Check TypeScript errors
pnpm --filter frontend tsc --noEmit

# Clear build cache
rm -rf packages/frontend/dist
rm -rf packages/frontend/node_modules/.vite

# Rebuild
pnpm build
```

#### 6. **Port already in use**

**Cause**: Another process using port 3000 or 4000

**Solution**:
```bash
# Find and kill process on port 4000
lsof -ti:4000 | xargs kill -9

# Or change port in .env
# Backend: PORT=4001
# Frontend: Update VITE_API_URL accordingly
```

### Getting Help

If you encounter issues not covered here:

1. **Check Browser Console**: Look for JavaScript errors
2. **Check Server Logs**: Backend errors appear in terminal
3. **Verify Environment**: Ensure all environment variables are set
4. **Check Dependencies**: Run `pnpm install` again
5. **Clear Cache**: Clear browser cache and localStorage
6. **Review Documentation**: 
   - [Dynamic.xyz Docs](https://docs.dynamic.xyz/)
   - [Vite Docs](https://vitejs.dev/)
   - [Express Docs](https://expressjs.com/)

## Additional Resources

### Documentation Links
- [Dynamic.xyz Headless Email Auth](https://docs.dynamic.xyz/headless/headless-email)
- [Dynamic.xyz Headless MFA](https://docs.dynamic.xyz/headless/headless-mfa)
- [ethers.js Documentation](https://docs.ethers.org/v6/)
- [React 18 Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [pnpm Workspaces](https://pnpm.io/workspaces)

### Project Scripts Reference

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start both frontend and backend in development mode |
| `pnpm build` | Build both packages for production |
| `pnpm start` | Start backend in production mode |
| `pnpm test` | Run all tests |
| `pnpm --filter frontend dev` | Start frontend dev server only |
| `pnpm --filter backend dev` | Start backend dev server only |
| `pnpm --filter frontend build` | Build frontend for production |
| `pnpm --filter frontend preview` | Preview production build |
| `pnpm --filter frontend lint` | Run ESLint on frontend |
| `pnpm --filter backend test` | Run backend tests |
| `pnpm --filter frontend test` | Run frontend tests |

---

**Built with ❤️ using React, TypeScript, Node.js, Express, Dynamic.xyz, and ethers.js**
