import { useState, useEffect } from 'react';
import { SignedMessageType } from '../context/DynamicContext';
import { verifySignature } from '../services/api';
import { VerificationResponse } from '../types/message';

interface MessageFormProps {
  addToHistory?: (message: SignedMessageType) => void;
  user?: any;
  primaryWallet?: any;
  addMessageToHistory?: (message: SignedMessageType) => void;
}

const MessageForm = ({ addToHistory, user, primaryWallet, addMessageToHistory }: MessageFormProps = {}) => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  
  // Ensure the component is properly mounted
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  const [error, setError] = useState<string | null>(null);
  const [verificationResult, setVerificationResult] = useState<VerificationResponse | null>(null);
  
  // Use the context's addMessageToHistory if available, otherwise use the prop
  const handleAddToHistory = (message: SignedMessageType) => {
    if (addMessageToHistory && typeof addMessageToHistory === 'function') {
      addMessageToHistory(message);
    } else if (addToHistory && typeof addToHistory === 'function') {
      addToHistory(message);
    }
  };
  
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
    
    // Validate that the wallet has the signMessage method
    if (typeof primaryWallet.signMessage !== 'function') {
      setError('Wallet does not support message signing');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setVerificationResult(null);
    
    try {
      // Sign the message using the connected wallet
      if (!primaryWallet || typeof primaryWallet.signMessage !== 'function') {
        throw new Error('Wallet not properly connected or does not support signing');
      }
      
      // Use try-catch for the actual signing operation
      let signature;
      try {
        signature = await primaryWallet.signMessage({ message });
        
        // Verify that signature is a valid string
        if (!signature || typeof signature !== 'string') {
          throw new Error('Invalid signature format returned from wallet');
        }
      } catch (signError) {
        console.error('Error during message signing:', signError);
        throw new Error(signError instanceof Error ? signError.message : 'Failed to sign message with wallet');
      }
      
      // Create a new signed message object
      const newSignedMessage: SignedMessageType = {
        id: Date.now().toString(),
        message,
        signature,
        timestamp: Date.now(),
      };
      
      // Verify the signature with the backend
      let verificationResponse;
      try {
        verificationResponse = await verifySignature(message, signature);
        
        // Validate the response
        if (!verificationResponse || typeof verificationResponse !== 'object') {
          throw new Error('Invalid verification response format');
        }
        
        // Ensure the response has the expected properties
        const isValid = verificationResponse.isValid === true;
        const signer = verificationResponse.signer || '';
        
        // Update the signed message with verification results
        newSignedMessage.verified = isValid;
        newSignedMessage.signer = signer;
        
        // Add to history
        handleAddToHistory(newSignedMessage);
        
        // Show verification result
        setVerificationResult({
          isValid,
          signer,
          originalMessage: message
        });
      } catch (verifyError) {
        console.error('Error verifying signature:', verifyError);
        
        // Create a fallback verification result
        const fallbackResult = {
          isValid: false,
          signer: '',
          originalMessage: message,
          error: verifyError instanceof Error ? verifyError.message : 'Verification failed'
        };
        
        // Update the signed message with error state
        newSignedMessage.verified = false;
        newSignedMessage.signer = '';
        
        // Add to history anyway
        handleAddToHistory(newSignedMessage);
        
        // Show error result
        setVerificationResult(fallbackResult as VerificationResponse);
      }
      
      // Clear the form
      setMessage('');
    } catch (err) {
      console.error('Error signing message:', err);
      setError(err instanceof Error ? err.message : 'Failed to sign message');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isInitializing) {
    return (
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Sign a Message</h2>
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }
  
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
            {(() => {
              // Safely extract wallet address with multiple fallbacks
              try {
                if (!primaryWallet) return 'Not connected';
                if (typeof primaryWallet !== 'object') return 'Invalid wallet data';
                
                // Try to access address safely
                const address = primaryWallet.address;
                if (address === null || address === undefined) {
                  // Fallback to user.walletPublicKey if available
                  if (user && user.walletPublicKey) {
                    return '' + user.walletPublicKey;
                  }
                  return 'No wallet address';
                }
                
                // Return as plain string, avoiding toString()
                return '' + address;
              } catch (error) {
                console.error('Error displaying wallet address:', error);
                return 'Error displaying address';
              }
            })()}
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
              Signer: <span className="font-mono">{verificationResult.signer || 'Unknown'}</span>
            </p>
            {(verificationResult as any).error && (
              <p className="text-sm mt-1 text-red-600">
                Error: {(verificationResult as any).error}
              </p>
            )}
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
