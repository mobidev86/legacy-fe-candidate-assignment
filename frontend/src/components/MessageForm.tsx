import React, { useState } from 'react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { useMessageContext } from '../contexts/MessageContext';
import { verifySignature } from '../services/api';
import { SignedMessage } from '../types';

const MessageForm: React.FC = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dynamicContext = useDynamicContext();
  const { addMessage } = useMessageContext();
  const isConnected = !!dynamicContext.user;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      setError('Please enter a message to sign');
      return;
    }

    if (!isConnected) {
      setError('Wallet not connected');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Use the Dynamic SDK to sign the message
      let signature;
      try {
        // @ts-ignore - The type definitions might be incorrect
        signature = await dynamicContext.primaryWallet?.signMessage(message);
        
        if (!signature) {
          throw new Error('Failed to get signature from wallet');
        }
      } catch (signError) {
        console.error('Error signing with wallet:', signError);
        setError('Failed to sign message with wallet');
        setLoading(false);
        return;
      }
      
      // Create a signed message object
      const signedMessage: SignedMessage = {
        message,
        signature,
        timestamp: Date.now(),
      };

      // Add to message history
      addMessage(signedMessage);

      // Verify the signature with our backend
      try {
        const verificationResult = await verifySignature(message, signature);
        console.log('Verification result:', verificationResult);
        
        // Update the message with verification result
        addMessage({
          ...signedMessage,
          verified: verificationResult.isValid,
          signer: verificationResult.signer
        });
      } catch (verifyError) {
        console.error('Verification error:', verifyError);
        // Continue anyway but mark as unverified
        addMessage({
          ...signedMessage,
          verified: false
        });
      }
      
      // Clear the form
      setMessage('');
      
    } catch (err) {
      console.error('Error signing message:', err);
      setError(err instanceof Error ? err.message : 'Failed to sign message');
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return null; // Don't show the form if user is not connected
  }

  return (
    <div className="message-form">
      <h2>Sign a Message</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="message">Message:</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter a message to sign..."
            rows={4}
            disabled={loading}
            required
          />
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <button 
          type="submit" 
          className="sign-button"
          disabled={loading || !message.trim()}
        >
          {loading ? 'Signing...' : 'Sign Message'}
        </button>
      </form>
    </div>
  );
};

export default MessageForm;
