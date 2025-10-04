import { useMemo } from 'react';
import { useSafeDynamicContext } from '../context/DynamicContext';
import MessageForm from '../components/MessageForm';
import MessageHistory from '../components/MessageHistory';
import AuthButton from '../components/AuthButton';

const MessageSignerPage = () => {
  const contextData = useSafeDynamicContext();
  const user = contextData?.user;
  const showAuthFlow = contextData?.showAuthFlow;
  const messageHistory = useMemo(() => contextData?.messageHistory || [], [contextData?.messageHistory]);
  
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
