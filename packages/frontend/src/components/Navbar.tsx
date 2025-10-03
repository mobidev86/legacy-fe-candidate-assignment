import { Link } from 'react-router-dom';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';

const Navbar = () => {
  const { user, handleLogOut, showAuthFlow } = useDynamicContext();
  
  const shortenAddress = (address: string) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
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
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  {shortenAddress(user.walletPublicKey || '')}
                </span>
                <button
                  onClick={handleLogOut}
                  className="btn btn-secondary text-sm"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={() => showAuthFlow()}
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
