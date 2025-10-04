import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
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
  handleLogOut: () => {},
  showAuthFlow: () => {},
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
        // Failed to parse message history
      }
    }
  }, []);

  // Save message history to localStorage whenever it changes
  useEffect(() => {
    if (messageHistory.length > 0) {
      localStorage.setItem('messageHistory', JSON.stringify(messageHistory));
    }
  }, [messageHistory]);

  // Add a message to history
  const addMessageToHistory = useCallback((newMessage: SignedMessageType) => {
    setMessageHistory(prev => [newMessage, ...prev]);
  }, []);

  // Enhanced mock implementation of showAuthFlow with email-based authentication
  const showAuthFlow = useCallback(() => {
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
    }, 1000);
  }, []);

  // Mock implementation of handleLogOut
  const handleLogOut = useCallback(() => {
    setIsLoading(true);
    
    // Simulate logout delay
    setTimeout(() => {
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
    }, 500);
  }, []);

  // Enhanced mock wallet with signMessage capability
  const primaryWallet = useMemo(() => user ? {
    address: user.walletPublicKey,
    chainId: 1, // Ethereum Mainnet
    connector: 'mock',
    signMessage: async ({ message }: { message: string }) => {
      // Simulate signing delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Return a mock signature that's more realistic
      return `0x${''.padStart(130, '0123456789abcdef')}`;
    }
  } : null, [user]);

  const value = useMemo(() => ({
    user,
    primaryWallet,
    handleLogOut,
    showAuthFlow,
    isAuthenticated,
    isLoading,
    messageHistory,
    addMessageToHistory
  }), [user, primaryWallet, handleLogOut, showAuthFlow, isAuthenticated, isLoading, messageHistory, addMessageToHistory]);

  return (
    <MockDynamicContext.Provider value={value}>
      {children}
    </MockDynamicContext.Provider>
  );
};

// Create a hook to use the mock context
export const useMockDynamicContext = () => useContext(MockDynamicContext);

// Centralized fallback authentication function
const createFallbackAuthFlow = (context?: any) => () => {
  // Try setShowAuthFlow first (newer SDK versions)
  if (context && typeof context.setShowAuthFlow === 'function') {
    try {
      context.setShowAuthFlow(true);
      return;
    } catch (error) {
      // setShowAuthFlow failed, try other methods
    }
  }
  
  // Check if we can access the authentication flow through other means
  if (context && typeof context.openWallet === 'function') {
    context.openWallet();
    return;
  }
  
  // Try to access the authentication modal through the window.dynamic object
  if (window && (window as any).dynamic) {
    if (typeof (window as any).dynamic.open === 'function') {
      (window as any).dynamic.open();
      return;
    }
    if ((window as any).dynamic.auth && typeof (window as any).dynamic.auth.openAuth === 'function') {
      (window as any).dynamic.auth.openAuth();
      return;
    }
  }
  
  // If all else fails, show an alert
  alert('Authentication flow is not available. Please try again later.');
};

// Helper to manage message history in localStorage
const messageHistoryManager = {
  get: (): SignedMessageType[] => {
    try {
      const savedHistory = localStorage.getItem('messageHistory');
      return savedHistory ? JSON.parse(savedHistory) : [];
    } catch (error) {
      return [];
    }
  },
  add: (newMessage: SignedMessageType): SignedMessageType[] => {
    try {
      const currentHistory = messageHistoryManager.get();
      const updatedHistory = [newMessage, ...currentHistory];
      localStorage.setItem('messageHistory', JSON.stringify(updatedHistory));
      return updatedHistory;
    } catch (error) {
      return [];
    }
  }
};

// Export a unified hook that will work regardless of which context is available
export const useSafeDynamicContext = () => {
  try {
    const context = useRealDynamicContext();
    
    // Check if context is actually populated
    const contextAny = context as any;
    
    // Determine the best authentication method to use
    let authFlowFunction;
    
    if (typeof context.setShowAuthFlow === 'function') {
      authFlowFunction = () => {
        try {
          context.setShowAuthFlow(true);
        } catch (error) {
          createFallbackAuthFlow(context)();
        }
      };
    } else if (typeof context.showAuthFlow === 'function') {
      authFlowFunction = context.showAuthFlow;
    } else {
      authFlowFunction = createFallbackAuthFlow(context);
    }
    
    // Get the primary wallet - try multiple sources
    let primaryWallet = context.primaryWallet;
    
    // If primaryWallet is not available, try to get it from wallets array
    if (!primaryWallet && contextAny.wallets && contextAny.wallets.length > 0) {
      primaryWallet = contextAny.wallets[0];
    }
    
    // Wallet successfully retrieved
    
    // If we get here without error, return an enhanced version of the real context
    const enhancedContext = {
      ...context,
      primaryWallet,
      messageHistory: messageHistoryManager.get(),
      addMessageToHistory: messageHistoryManager.add,
      showAuthFlow: authFlowFunction
    };
    
    return enhancedContext;
  } catch (error) {
    // If using the real hook fails, fall back to our mock
    return useMockDynamicContext();
  }
};
