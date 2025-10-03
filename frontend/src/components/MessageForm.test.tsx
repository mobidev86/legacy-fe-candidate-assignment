import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MessageForm from './MessageForm';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { useMessageContext } from '../contexts/MessageContext';
import { verifySignature } from '../services/api';

// Mock dependencies
jest.mock('@dynamic-labs/sdk-react-core', () => ({
  useDynamicContext: jest.fn(),
}));

jest.mock('../contexts/MessageContext', () => ({
  useMessageContext: jest.fn(),
}));

jest.mock('../services/api', () => ({
  verifySignature: jest.fn(),
}));

describe('MessageForm Component', () => {
  const mockAddMessage = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock useDynamicContext
    (useDynamicContext as jest.Mock).mockReturnValue({
      user: { id: '123' }, // Mock a connected user
    });
    
    // Mock useMessageContext
    (useMessageContext as jest.Mock).mockReturnValue({
      addMessage: mockAddMessage,
    });
    
    // Mock verifySignature
    (verifySignature as jest.Mock).mockResolvedValue({
      isValid: true,
      signer: '0x1234567890abcdef1234567890abcdef12345678',
      originalMessage: 'Test message',
    });
  });

  it('renders the form when user is connected', () => {
    render(<MessageForm />);
    expect(screen.getByText('Sign a Message')).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign message/i })).toBeInTheDocument();
  });

  it('does not render when user is not connected', () => {
    (useDynamicContext as jest.Mock).mockReturnValue({
      user: null, // No connected user
    });
    
    const { container } = render(<MessageForm />);
    expect(container).toBeEmptyDOMElement();
  });

  it('handles message submission', async () => {
    render(<MessageForm />);
    
    // Fill in the message
    const messageInput = screen.getByLabelText(/message/i);
    fireEvent.change(messageInput, { target: { value: 'Test message' } });
    
    // Submit the form
    const submitButton = screen.getByRole('button', { name: /sign message/i });
    fireEvent.click(submitButton);
    
    // Check that the message was added
    await waitFor(() => {
      expect(mockAddMessage).toHaveBeenCalled();
    });
    
    // Check that the verification was called
    expect(verifySignature).toHaveBeenCalled();
    
    // Check that the form was cleared
    expect(messageInput).toHaveValue('');
  });

  it('shows error when message is empty', async () => {
    render(<MessageForm />);
    
    // Submit with empty message
    const submitButton = screen.getByRole('button', { name: /sign message/i });
    fireEvent.click(submitButton);
    
    // Check for error message
    expect(screen.getByText(/please enter a message/i)).toBeInTheDocument();
    
    // Check that no message was added
    expect(mockAddMessage).not.toHaveBeenCalled();
  });
});
