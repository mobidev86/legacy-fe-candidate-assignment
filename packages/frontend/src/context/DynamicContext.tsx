import React, { createContext, useContext, useState, useEffect } from 'react';
import { useDynamicContext as useRealDynamicContext } from '@dynamic-labs/sdk-react-core';

// Enhanced interface for our Dynamic context
interface EnhancedDynamicContextType {
  user: null | { walletPublicKey?: string; email?: string };
  primaryWallet: null | { 
    address?: string;
    chainId?: number;
    connector?: string;
    signMessage?: (args: { message: string }) => Promise<string>;
  };
  handleLogOut: () => void;
  showAuthFlow: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  messageHistory: SignedMessageType[];
  addMessageToHistory: (message: SignedMessageType) => void;
}

// Define the signed message type
export interface SignedMessageType {
  id: string;
  message: string;
  signature: string;
  timestamp: number;
  verified?: boolean;
  signer?: string;
}

const defaultContext: EnhancedDynamicContextType = {
  user: null,
  primaryWallet: null,
  handleLogOut: () => console.log('Mock logout called'),
  showAuthFlow: () => console.log('Mock auth flow called'),
  isAuthenticated: false,
  isLoading: false,
  messageHistory: [],
  addMessageToHistory: () => {}
};

// Create the context
const MockDynamicContext = createContext<EnhancedDynamicContextType>(defaultContext);

// Create a provider component with enhanced functionality
export const MockDynamicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<null | { walletPublicKey?: string; email?: string }>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messageHistory, setMessageHistory] = useState<SignedMessageType[]>([]);

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

  // Add a message to history
  const addMessageToHistory = (newMessage: SignedMessageType) => {
    setMessageHistory(prev => [newMessage, ...prev]);
  };

  // Enhanced mock implementation of showAuthFlow with email-based authentication
  const showAuthFlow = () => {
    setIsLoading(true);
    
    // Simulate a login delay
    setTimeout(() => {
      // Simulate a login with a mock wallet
      setUser({ 
        walletPublicKey: '0xMockAddress123456789',
        email: 'user@example.com'
      });
      setIsAuthenticated(true);
      setIsLoading(false);
      console.log('Mock auth flow triggered - user authenticated with email');
    }, 1000);
  };

  // Mock implementation of handleLogOut
  const handleLogOut = () => {
    setIsLoading(true);
    
    // Simulate logout delay
    setTimeout(() => {
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
      console.log('Mock logout triggered - user logged out');
    }, 500);
  };

  // Enhanced mock wallet with signMessage capability
  const primaryWallet = user ? {
    address: user.walletPublicKey,
    chainId: 1, // Ethereum Mainnet
    connector: 'mock',
    signMessage: async ({ message }: { message: string }) => {
      console.log('Mock signing message:', message);
      
      // Simulate signing delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Return a mock signature that's more realistic
      return `0x${''.padStart(130, '0123456789abcdef')}`;
    }
  } : null;

  const value = {
    user,
    primaryWallet,
    handleLogOut,
    showAuthFlow,
    isAuthenticated,
    isLoading,
    messageHistory,
    addMessageToHistory
  };

  return (
    <MockDynamicContext.Provider value={value}>
      {children}
    </MockDynamicContext.Provider>
  );
};

// Create a hook to use the mock context
export const useMockDynamicContext = () => useContext(MockDynamicContext);

// Export a unified hook that will work regardless of which context is available
export const useSafeDynamicContext = () => {
  try {
    // Try to use the real Dynamic context
    try {
      console.log('Attempting to use real Dynamic.xyz context...');
      const context = useRealDynamicContext();
      console.log('Real Dynamic.xyz context successfully obtained:', context);
      
      // If we get here without error, return an enhanced version of the real context
      // that includes our additional functionality
      const enhancedContext = {
        ...context,
        messageHistory: (() => {
          // Load message history from localStorage
          try {
            const savedHistory = localStorage.getItem('messageHistory');
            return savedHistory ? JSON.parse(savedHistory) : [];
          } catch (error) {
            console.error('Failed to parse message history:', error);
            return [];
          }
        })(),
        addMessageToHistory: (newMessage: SignedMessageType) => {
          try {
            // Get current history
            const savedHistory = localStorage.getItem('messageHistory');
            const currentHistory = savedHistory ? JSON.parse(savedHistory) : [];
            
            // Add new message to history
            const updatedHistory = [newMessage, ...currentHistory];
            
            // Save updated history
            localStorage.setItem('messageHistory', JSON.stringify(updatedHistory));
            
            return updatedHistory;
          } catch (error) {
            console.error('Failed to add message to history:', error);
            return [];
          }
        }
      };
      
      // Ensure showAuthFlow is always a function
      if (typeof enhancedContext.showAuthFlow !== 'function') {
        console.warn('showAuthFlow is not a function in the real context, providing a fallback');
        // Use type assertion to avoid TypeScript errors
        (enhancedContext as any).showAuthFlow = () => {
          console.log('Fallback showAuthFlow called');
          alert('Authentication flow is not available. Please try again later.');
        };
      }
      
      return enhancedContext;
    } catch (error) {
      // If using the real hook fails, fall back to our mock
      console.warn('Falling back to mock Dynamic context:', error);
      return useMockDynamicContext();
    }
  } catch (error) {
    // If importing the real hook fails, fall back to our mock
    console.warn('Dynamic SDK not available, using mock context:', error);
    return useMockDynamicContext();
  }
};
