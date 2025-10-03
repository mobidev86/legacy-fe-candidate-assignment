import React from 'react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';

const WalletConnect: React.FC = () => {
  // Use the Dynamic context to access user and auth functions
  const dynamicContext = useDynamicContext();
  const isConnected = !!dynamicContext.user;
  
  // In a real app, you would get the actual wallet address from the SDK
  // For now, we'll just use a placeholder if connected
  const walletAddress = isConnected ? '0x...Connected Wallet' : 'Not connected';

  const handleConnect = () => {
    // In a real implementation, we would use Dynamic SDK to show the auth flow
    // For now, just log that we would connect
    console.log('Would show auth flow here');
    // Note: In a real implementation with proper types, we would use:
    // dynamicContext.showAuthFlow();
  };

  const handleDisconnect = () => {
    // In a real implementation, we would use Dynamic SDK to log out
    // For now, just log that we would disconnect
    console.log('Would disconnect wallet here');
    // Note: In a real implementation with proper types, we would use:
    // dynamicContext.handleLogOut();
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
