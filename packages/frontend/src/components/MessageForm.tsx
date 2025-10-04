import { useState, useEffect, useRef } from 'react';
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
  const [isSigningStep, setIsSigningStep] = useState(false);
  const [isVerifyingStep, setIsVerifyingStep] = useState(false);
  const [currentStep, setCurrentStep] = useState(0); // 0: initial, 1: signing, 2: verifying, 3: complete
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Ensure the component is properly mounted
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitializing(false);
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
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
  
  // Helper function to get wallet address
  const getWalletAddress = () => {
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
  };
  
  // Format wallet address for display
  const formatWalletAddress = (address: string) => {
    if (!address || address === 'Not connected' || address === 'Invalid wallet data' || 
        address === 'No wallet address' || address === 'Error displaying address') {
      return address;
    }
    
    try {
      return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    } catch (error) {
      return address;
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
    setCurrentStep(1); // Start signing step
    setIsSigningStep(true);
    
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
      
      // Update UI to show verifying step
      setIsSigningStep(false);
      setCurrentStep(2); // Verifying step
      setIsVerifyingStep(true);
      
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
      
      // Complete the process
      setCurrentStep(3); // Complete step
      setIsVerifyingStep(false);
      
      // Clear the form
      setMessage('');
    } catch (err) {
      console.error('Error signing message:', err);
      setError(err instanceof Error ? err.message : 'Failed to sign message');
      setIsSigningStep(false);
      setIsVerifyingStep(false);
      setCurrentStep(0); // Reset to initial state on error
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleReset = () => {
    setMessage('');
    setError(null);
    setVerificationResult(null);
    setCurrentStep(0);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };
  
  if (isInitializing) {
    return (
      <div className="card animate-fade-in">
        <div className="card-header">
          <h2 className="card-title">Sign a Message</h2>
        </div>
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="card animate-fade-in">
      <div className="card-header">
        <h2 className="card-title">Sign a Message</h2>
        <div className="flex space-x-1">
          {[1, 2, 3].map((step) => (
            <div 
              key={step}
              className={`h-2 w-8 rounded-full transition-all duration-300 ${
                currentStep >= step ? 'bg-primary-500' : 'bg-gray-200'
              }`}
            ></div>
          ))}
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="message" className="input-label">
            Message to Sign
          </label>
          <textarea
            ref={textareaRef}
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="input min-h-[120px] transition-all duration-200 focus:shadow-md"
            placeholder="Enter a message to sign with your wallet..."
            disabled={isLoading}
          />
          {message.trim().length > 0 && (
            <div className="flex justify-end mt-1">
              <span className="text-xs text-dark-500">
                {message.length} characters
              </span>
            </div>
          )}
        </div>
        
        <div className="input-group">
          <div className="flex justify-between items-center mb-1">
            <label className="input-label">Connected Wallet</label>
            <span className="badge badge-info">
              {user ? 'Connected' : 'Not Connected'}
            </span>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 flex items-center space-x-3">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-sm flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <div className="overflow-hidden">
              <div className="font-mono text-sm text-dark-800 break-all">
                {formatWalletAddress(getWalletAddress())}
              </div>
              {user?.email && (
                <div className="text-xs text-dark-500 truncate">
                  {user.email}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {error && (
          <div className="alert alert-error animate-fade-in">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}
        
        {verificationResult && (
          <div className={`alert ${verificationResult.isValid ? 'alert-success' : 'alert-error'} animate-fade-in`}>
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-0.5">
                {verificationResult.isValid ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium">
                  {verificationResult.isValid ? 'Signature Valid' : 'Signature Invalid'}
                </h3>
                <div className="mt-1 text-xs">
                  <div className="font-medium">Signer Address:</div>
                  <div className="font-mono break-all">
                    {verificationResult.signer || 'Unknown'}
                  </div>
                  {(verificationResult as any).error && (
                    <div className="mt-1 text-red-600">
                      Error: {(verificationResult as any).error}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          {currentStep === 3 && verificationResult ? (
            <>
              <button
                type="button"
                onClick={handleReset}
                className="btn btn-secondary flex-1"
              >
                Sign Another Message
              </button>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(verificationResult.signer || '');
                }}
                className="btn btn-outline flex-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                Copy Signer Address
              </button>
            </>
          ) : (
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isLoading || !message.trim()}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  {isSigningStep ? 'Signing...' : isVerifyingStep ? 'Verifying...' : 'Processing...'}
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Sign & Verify Message
                </div>
              )}
            </button>
          )}
        </div>
      </form>
      
      {!isLoading && !verificationResult && (
        <div className="mt-6 pt-6 border-t border-gray-100">
          <div className="text-sm text-dark-500">
            <div className="flex items-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">How it works</span>
            </div>
            <p className="pl-6 text-xs">
              When you sign a message, your wallet creates a cryptographic signature that proves you control the private key. 
              Our backend then verifies this signature and confirms the signer's address.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageForm;
