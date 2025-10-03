import React from 'react';
import './App.css';
import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core';
import WalletConnect from './components/WalletConnect';
import MessageForm from './components/MessageForm';
import MessageHistory from './components/MessageHistory';
import { MessageProvider } from './contexts/MessageContext';

function App() {
  // Replace with your Dynamic.xyz environment ID
  const dynamicEnvironmentId = process.env.REACT_APP_DYNAMIC_ENVIRONMENT_ID || 'YOUR_DYNAMIC_ENVIRONMENT_ID';

  return (
    // Note: In a real implementation, you would properly configure the Dynamic SDK
    // For now, we're using a simplified version to avoid TypeScript errors
    <DynamicContextProvider
      settings={{
        environmentId: dynamicEnvironmentId,
      }}
    >
      <MessageProvider>
        <div className="App">
          <header className="App-header">
            <h1>Web3 Message Signer & Verifier</h1>
          </header>
          
          <main className="App-main">
            <WalletConnect />
            <MessageForm />
            <MessageHistory />
          </main>
          
          <footer className="App-footer">
            <p>Built with React + Dynamic.xyz + Ethereum</p>
          </footer>
        </div>
      </MessageProvider>
    </DynamicContextProvider>
  );
}

export default App;
