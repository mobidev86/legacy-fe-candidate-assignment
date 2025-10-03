import { useState, useEffect } from 'react';
// Import our safe context hook instead of the direct Dynamic.xyz hook
import { useSafeDynamicContext } from '../context/DynamicContext';
import MessageForm from '../components/MessageForm';
import MessageHistory from '../components/MessageHistory';

const MessageSignerPage = () => {
  // Use our safe context hook that works with both real and mock contexts
  const dynamicContext = useSafeDynamicContext() as any;
  const { user, showAuthFlow, messageHistory = [] } = dynamicContext || {};
  
  const [authLoading, setAuthLoading] = useState(true);
  
  // Add a small delay to ensure the user state is properly loaded
  useEffect(() => {
    const timer = setTimeout(() => {
      setAuthLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  if (authLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading authentication status...</p>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Please connect your wallet</h2>
        <p className="text-gray-600 mb-6">You need to connect your wallet to sign messages</p>
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
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Sign & Verify Messages</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <MessageForm />
        </div>
        
        <div>
          <MessageHistory messages={messageHistory} />
        </div>
      </div>
    </div>
  );
};

export default MessageSignerPage;
