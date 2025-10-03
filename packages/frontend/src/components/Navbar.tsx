import { Link } from 'react-router-dom';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { useState, useEffect } from 'react';

const Navbar = () => {
  // Cast the context to any to avoid TypeScript errors with the Dynamic SDK
  const dynamicContext = useDynamicContext() as any;
  const { user, handleLogOut, showAuthFlow } = dynamicContext;
  const [isLoading, setIsLoading] = useState(true);
  
  // Add a small delay to ensure the user state is properly loaded
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  const shortenAddress = (address: string | undefined | null) => {
    if (!address || typeof address !== 'string') return 'Not connected';
    try {
      return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    } catch (error) {
      console.error('Error shortening address:', error);
      return 'Invalid address';
    }
  };
  
  // Get wallet address safely
  // Access the wallet address from the user object, with proper type handling
  const walletAddress = user ? (user as any).walletPublicKey || '' : '';

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-primary-600">
              Web3 Message Signer
            </Link>
            <div className="ml-10 space-x-6 hidden md:flex">
              <Link to="/" className="text-gray-700 hover:text-primary-600">
                Home
              </Link>
              {user && (
                <Link to="/sign-message" className="text-gray-700 hover:text-primary-600">
                  Sign Message
                </Link>
              )}
            </div>
          </div>
          <div>
            {isLoading ? (
              <div className="w-32 h-8 bg-gray-200 animate-pulse rounded"></div>
            ) : user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  {shortenAddress(walletAddress)}
                </span>
                <button
                  onClick={() => {
                    try {
                      handleLogOut();
                    } catch (error) {
                      console.error('Error logging out:', error);
                    }
                  }}
                  className="btn btn-secondary text-sm"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  try {
                    showAuthFlow();
                  } catch (error) {
                    console.error('Error showing auth flow:', error);
                  }
                }}
                className="btn btn-primary"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
