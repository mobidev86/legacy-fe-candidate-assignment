import { useState } from 'react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { verifySignature } from '../services/api';
import { SignedMessage, VerificationResponse } from '../types/message';

interface MessageFormProps {
  addToHistory: (message: SignedMessage) => void;
}

const MessageForm = ({ addToHistory }: MessageFormProps) => {
  const { user, primaryWallet } = useDynamicContext();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verificationResult, setVerificationResult] = useState<VerificationResponse | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      setError('Please enter a message to sign');
      return;
    }
    
    if (!primaryWallet) {
      setError('Wallet not connected');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setVerificationResult(null);
    
    try {
      // Sign the message using the connected wallet
      const signature = await primaryWallet.signMessage({ message });
      
      // Create a new signed message object
      const newSignedMessage: SignedMessage = {
        id: Date.now().toString(),
        message,
        signature,
        timestamp: Date.now(),
      };
      
      // Verify the signature with the backend
      const verificationResponse = await verifySignature(message, signature);
      
      // Update the signed message with verification results
      newSignedMessage.verified = verificationResponse.isValid;
      newSignedMessage.signer = verificationResponse.signer;
      
      // Add to history
      addToHistory(newSignedMessage);
      
      // Show verification result
      setVerificationResult(verificationResponse);
      
      // Clear the form
      setMessage('');
    } catch (err) {
      console.error('Error signing message:', err);
      setError(err instanceof Error ? err.message : 'Failed to sign message');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">Sign a Message</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Message
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="input min-h-[100px]"
            placeholder="Enter a message to sign..."
            disabled={isLoading}
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Connected Address
          </label>
          <div className="bg-gray-100 p-2 rounded text-gray-800 font-mono text-sm break-all">
            {user?.walletPublicKey || 'Not connected'}
          </div>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        {verificationResult && (
          <div className={`mb-4 p-3 rounded-md ${verificationResult.isValid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            <p className="font-medium">
              {verificationResult.isValid ? 'Signature Valid ✓' : 'Signature Invalid ✗'}
            </p>
            <p className="text-sm mt-1">
              Signer: <span className="font-mono">{verificationResult.signer}</span>
            </p>
          </div>
        )}
        
        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={isLoading || !message.trim()}
        >
          {isLoading ? 'Signing...' : 'Sign & Verify Message'}
        </button>
      </form>
    </div>
  );
};

export default MessageForm;
