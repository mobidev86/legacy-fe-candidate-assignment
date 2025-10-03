import { useState, useEffect } from 'react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import MessageForm from '../components/MessageForm';
import MessageHistory from '../components/MessageHistory';
import { SignedMessage } from '../types/message';

const MessageSignerPage = () => {
  const { user, showAuthFlow } = useDynamicContext();
  const [messageHistory, setMessageHistory] = useState<SignedMessage[]>([]);
  
  // Load message history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('messageHistory');
    if (savedHistory) {
      try {
        setMessageHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Failed to parse message history:', error);
      }
    }
  }, []);
  
  // Save message history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('messageHistory', JSON.stringify(messageHistory));
  }, [messageHistory]);
  
  const addToHistory = (newMessage: SignedMessage) => {
    setMessageHistory(prev => [newMessage, ...prev]);
  };
  
  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Please connect your wallet</h2>
        <p className="text-gray-600 mb-6">You need to connect your wallet to sign messages</p>
        <button 
          onClick={() => showAuthFlow()} 
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
          <MessageForm addToHistory={addToHistory} />
        </div>
        
        <div>
          <MessageHistory messages={messageHistory} />
        </div>
      </div>
    </div>
  );
};

export default MessageSignerPage;
