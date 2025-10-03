import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSafeDynamicContext } from '../context/DynamicContext';

const HomePage = () => {
  // Get the context directly - now it's safe because we're inside a provider
  const contextData = useSafeDynamicContext();
  const user = contextData?.user;
  const showAuthFlow = contextData?.showAuthFlow;
  
  const [isLoading, setIsLoading] = useState(true);
  
  // Simple loading state for UI elements
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  // No need for error handling here anymore

  return (
    <div className="max-w-3xl mx-auto text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">
        Web3 Message Signer & Verifier
      </h1>
      
      <p className="text-xl text-gray-600 mb-8">
        Securely sign messages with your Ethereum wallet and verify signatures on-chain.
      </p>
      
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-semibold mb-4">How it works</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4">
            <div className="text-primary-600 text-2xl font-bold mb-2">1</div>
            <h3 className="text-lg font-medium mb-2">Connect Wallet</h3>
            <p className="text-gray-600">Authenticate securely using Dynamic.xyz's embedded wallet solution.</p>
          </div>
          
          <div className="p-4">
            <div className="text-primary-600 text-2xl font-bold mb-2">2</div>
            <h3 className="text-lg font-medium mb-2">Sign Message</h3>
            <p className="text-gray-600">Create and sign a custom message with your wallet.</p>
          </div>
          
          <div className="p-4">
            <div className="text-primary-600 text-2xl font-bold mb-2">3</div>
            <h3 className="text-lg font-medium mb-2">Verify Signature</h3>
            <p className="text-gray-600">Our backend verifies your signature and confirms the signer address.</p>
          </div>
        </div>
      </div>
      
      {isLoading ? (
        <div className="btn btn-primary text-lg px-8 py-3 opacity-50 cursor-not-allowed">
          Loading...
        </div>
      ) : user ? (
        <Link to="/sign-message" className="btn btn-primary text-lg px-8 py-3">
          Sign a Message
        </Link>
      ) : (
        <button 
          onClick={() => {
            try {
              if (typeof showAuthFlow === 'function') {
                showAuthFlow();
              } else {
                console.error('showAuthFlow is not a function');
              }
            } catch (error) {
              console.error('Error showing auth flow:', error);
            }
          }} 
          className="btn btn-primary text-lg px-8 py-3"
        >
          Connect Wallet to Get Started
        </button>
      )}
    </div>
  );
};

export default HomePage;
