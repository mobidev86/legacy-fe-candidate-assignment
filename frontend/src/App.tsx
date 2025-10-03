import React from 'react';
import './App.css';
import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core';
// Import without specifying the exact export
import * as EthereumModule from '@dynamic-labs/ethereum';
import WalletConnect from './components/WalletConnect';
import MessageForm from './components/MessageForm';
import MessageHistory from './components/MessageHistory';
import { MessageProvider } from './contexts/MessageContext';

function App() {
  // Get the Dynamic.xyz environment ID from .env
  const dynamicEnvironmentId = process.env.REACT_APP_DYNAMIC_ENVIRONMENT_ID;
  
  if (!dynamicEnvironmentId || dynamicEnvironmentId === 'YOUR_DYNAMIC_ENVIRONMENT_ID') {
    console.error('Missing REACT_APP_DYNAMIC_ENVIRONMENT_ID in .env file');
  }

  // Create settings object with type assertion to avoid TypeScript errors
  const settings = {
    environmentId: dynamicEnvironmentId || '',
  };

  // Add wallet connectors if available
  if (EthereumModule.EthereumWalletConnectors) {
    (settings as any).walletConnectors = [EthereumModule.EthereumWalletConnectors];
  }

  return (
    <DynamicContextProvider
      settings={settings as any}
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
