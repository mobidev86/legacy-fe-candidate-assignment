import { useState, useEffect } from 'react';
import { useSafeDynamicContext } from '../context/DynamicContext';
import MessageForm from '../components/MessageForm';
import MessageHistory from '../components/MessageHistory';
import LoadingSpinner from '../components/LoadingSpinner';
import AuthButton from '../components/AuthButton';

const MessageSignerPage = () => {
  // Get the context directly - now it's safe because we're inside a provider
  const contextData = useSafeDynamicContext();
  const user = contextData?.user;
  // Ensure showAuthFlow is a function or provide a fallback
  const showAuthFlow = typeof contextData?.showAuthFlow === 'function' 
    ? contextData.showAuthFlow 
    : () => {
        console.warn('showAuthFlow is not available');
        alert('Authentication flow is not available. Please try again later.');
      };
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
    return <LoadingSpinner size="md" message="Loading authentication status..." className="py-12" />;
  }
  
  // No need for error handling here anymore
  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Please connect your wallet</h2>
        <p className="text-gray-600 mb-6">You need to connect your wallet to sign messages</p>
          <AuthButton 
            showAuthFlow={showAuthFlow}
            user={user}
            size="lg"
          />
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
