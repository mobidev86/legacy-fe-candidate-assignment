import { useState, useEffect } from 'react';
import { useSafeDynamicContext } from '../context/DynamicContext';
import MessageForm from '../components/MessageForm';
import MessageHistory from '../components/MessageHistory';

const MessageSignerPage = () => {
  // Get the context directly - now it's safe because we're inside a provider
  const contextData = useSafeDynamicContext();
  const user = contextData?.user;
  const showAuthFlow = contextData?.showAuthFlow;
  const messageHistory = contextData?.messageHistory || [];
  
  const [isLoading, setIsLoading] = useState(true);
  
  // Simple loading state for UI elements
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading authentication status...</p>
      </div>
    );
  }
  
  // No need for error handling here anymore
  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Please connect your wallet</h2>
        <p className="text-gray-600 mb-6">You need to connect your wallet to sign messages</p>
          <button 
            onClick={() => {
              try {
                console.log('showAuthFlow type:', typeof showAuthFlow);
                console.log('showAuthFlow value:', showAuthFlow);
                
                if (typeof showAuthFlow === 'function') {
                  showAuthFlow();
                } else {
                  console.error('showAuthFlow is not a function');
                  alert('Authentication is currently unavailable. Please try again later.');
                }
              } catch (error) {
                console.error('Error showing auth flow:', error);
                alert('An error occurred while trying to connect. Please try again.');
              }
            }} 
            className="btn btn-primary text-lg px-8 py-3"
          >Connect Wallet
        </button>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Sign & Verify Messages</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <MessageForm 
            user={user}
            primaryWallet={contextData?.primaryWallet}
            addMessageToHistory={contextData?.addMessageToHistory}
          />
        </div>
        
        <div>
          <MessageHistory messages={messageHistory} />
        </div>
      </div>
    </div>
  );
};

export default MessageSignerPage;
