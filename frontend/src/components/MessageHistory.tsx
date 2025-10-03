import React from 'react';
import { useMessageContext } from '../contexts/MessageContext';
import { verifySignature } from '../services/api';

const MessageHistory: React.FC = () => {
  const { messages, updateMessage } = useMessageContext();

  const handleVerify = async (index: number) => {
    const message = messages[index];
    
    try {
      const result = await verifySignature(message.message, message.signature);
      
      updateMessage(index, {
        verified: result.isValid,
        signer: result.signer
      });
      
    } catch (error) {
      console.error('Error verifying message:', error);
      updateMessage(index, {
        verified: false
      });
    }
  };

  if (messages.length === 0) {
    return (
      <div className="message-history empty">
        <h2>Message History</h2>
        <p>No signed messages yet. Sign a message to see it here.</p>
      </div>
    );
  }

  return (
    <div className="message-history">
      <h2>Message History</h2>
      <div className="messages-list">
        {messages.map((message, index) => (
          <div key={index} className="message-item">
            <div className="message-content">
              <p><strong>Message:</strong> {message.message}</p>
              <p className="signature"><strong>Signature:</strong> {`${message.signature.substring(0, 20)}...`}</p>
              <p><strong>Date:</strong> {new Date(message.timestamp).toLocaleString()}</p>
              
              {message.verified !== undefined && (
                <div className={`verification-result ${message.verified ? 'valid' : 'invalid'}`}>
                  <p>
                    <strong>Verification:</strong> {message.verified ? 'Valid ✓' : 'Invalid ✗'}
                  </p>
                  {message.verified && message.signer && (
                    <p><strong>Signer:</strong> {message.signer}</p>
                  )}
                </div>
              )}
            </div>
            
            {message.verified === undefined && (
              <button 
                onClick={() => handleVerify(index)}
                className="verify-button"
              >
                Verify
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessageHistory;
