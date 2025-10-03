import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SignedMessage } from '../types';

interface MessageContextType {
  messages: SignedMessage[];
  addMessage: (message: SignedMessage) => void;
  updateMessage: (index: number, updatedMessage: Partial<SignedMessage>) => void;
  clearMessages: () => void;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const useMessageContext = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessageContext must be used within a MessageProvider');
  }
  return context;
};

interface MessageProviderProps {
  children: ReactNode;
}

export const MessageProvider: React.FC<MessageProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<SignedMessage[]>(() => {
    // Load messages from localStorage on initial render
    const savedMessages = localStorage.getItem('signedMessages');
    return savedMessages ? JSON.parse(savedMessages) : [];
  });

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('signedMessages', JSON.stringify(messages));
  }, [messages]);

  const addMessage = (message: SignedMessage) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const updateMessage = (index: number, updatedMessage: Partial<SignedMessage>) => {
    setMessages((prevMessages) => {
      const newMessages = [...prevMessages];
      newMessages[index] = { ...newMessages[index], ...updatedMessage };
      return newMessages;
    });
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <MessageContext.Provider value={{ messages, addMessage, updateMessage, clearMessages }}>
      {children}
    </MessageContext.Provider>
  );
};
