import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Define props interface
interface NavbarProps {
  user?: any;
  handleLogOut?: () => void;
  showAuthFlow?: () => void;
  isAuthenticated?: boolean;
}

const Navbar = ({ user, handleLogOut, showAuthFlow }: NavbarProps = {}) => {
  // Log props for debugging
  console.log('Navbar props:', { 
    user: !!user, 
    handleLogOut: typeof handleLogOut, 
    showAuthFlow: typeof showAuthFlow 
  });
  
  const [isLoading, setIsLoading] = useState(true);
  
  // Add a small delay to ensure the user state is properly loaded
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
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
  
  // Get wallet address safely with multiple fallbacks
  const getWalletAddress = () => {
    try {
      // Only use user prop since we're not using the context directly anymore
      if (!user) return '';
      if (typeof user !== 'object') return '';
      
      // Try to access address from user.primaryWallet
      if (user.primaryWallet?.address) {
        return '' + user.primaryWallet.address;
      }
      
      // Try to access walletPublicKey safely
      const walletKey = (user as any).walletPublicKey;
      if (walletKey === null || walletKey === undefined) return '';
      
      // Return as plain string, avoiding toString()
      return '' + walletKey;
    } catch (error) {
      console.error('Error getting wallet address:', error);
      return '';
    }
  };

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
                <div className="flex flex-col items-end">
                  <span className="text-sm font-medium text-gray-800">
                    {shortenAddress(getWalletAddress())}
                  </span>
                  {user?.email && (
                    <span className="text-xs text-gray-500">
                      {user.email}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => {
                    try {
                      if (typeof handleLogOut === 'function') {
                        handleLogOut();
                      } else {
                        console.error('handleLogOut is not a function');
                      }
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
                    console.log('Navbar: showAuthFlow clicked, type:', typeof showAuthFlow);
                    console.log('Navbar: showAuthFlow value:', showAuthFlow);
                    
                    if (typeof showAuthFlow === 'function') {
                      console.log('Navbar: Calling showAuthFlow function');
                      showAuthFlow();
                    } else {
                      console.error('Navbar: showAuthFlow is not a function');
                      alert('Authentication is currently unavailable. Please try again later.');
                    }
                  } catch (error) {
                    console.error('Navbar: Error showing auth flow:', error);
                    alert('An error occurred while trying to connect. Please try again.');
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
