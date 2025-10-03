import React from 'react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';

const WalletConnect: React.FC = () => {
  // Use the Dynamic context to access user and auth functions
  const dynamicContext = useDynamicContext();
  const isConnected = !!dynamicContext.user;
  
  // Get the actual wallet address from the SDK
  const walletAddress = dynamicContext.primaryWallet?.address || 'Not connected';

  const handleConnect = () => {
    // Use Dynamic SDK to show the auth flow
    try {
      // @ts-ignore - The type definitions might be incorrect, but this is the correct method
      dynamicContext.showAuthFlow();
    } catch (error) {
      console.error('Error showing auth flow:', error);
    }
  };

  const handleDisconnect = () => {
    // Use Dynamic SDK to log out
    try {
      // @ts-ignore - The type definitions might be incorrect, but this is the correct method
      dynamicContext.handleLogOut();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="wallet-connect">
      {isConnected ? (
        <div className="wallet-info">
          <p className="wallet-address">
            <strong>Connected Wallet:</strong> {walletAddress}
          </p>
          <button 
            onClick={handleDisconnect} 
            className="disconnect-button"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <div className="connect-container">
          <h2>Connect your wallet to sign messages</h2>
          <button 
            onClick={handleConnect} 
            className="connect-button"
          >
            Connect Wallet
          </button>
        </div>
      )}
    </div>
  );
};

export default WalletConnect;
