import { useState } from 'react';
import { SignedMessageType } from '../context/DynamicContext';

interface MessageHistoryProps {
  messages: SignedMessageType[];
}

const MessageHistory = ({ messages = [] }: MessageHistoryProps) => {
  const [expandedMessage, setExpandedMessage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Ensure messages is an array
  const safeMessages = Array.isArray(messages) ? messages : [];
  
  const formatDate = (timestamp: number) => {
    try {
      const date = new Date(timestamp);
      return {
        fullDate: date.toLocaleString(),
        relativeTime: getRelativeTime(date)
      };
    } catch (error) {
      return {
        fullDate: 'Invalid date',
        relativeTime: 'Unknown'
      };
    }
  };
  
  // Helper function to get relative time
  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.round(diffMs / 1000);
    const diffMin = Math.round(diffSec / 60);
    const diffHour = Math.round(diffMin / 60);
    const diffDay = Math.round(diffHour / 24);
    
    if (diffSec < 60) return `${diffSec} sec ago`;
    if (diffMin < 60) return `${diffMin} min ago`;
    if (diffHour < 24) return `${diffHour} hr ago`;
    if (diffDay < 7) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
  };
  
  // Helper function to safely display signer addresses
  const formatSigner = (signer: string | undefined | null) => {
    if (!signer || typeof signer !== 'string') return 'Unknown';
    try {
      // Return shortened address for display
      return `${signer.substring(0, 6)}...${signer.substring(signer.length - 4)}`;
    } catch (error) {
      return signer;
    }
  };
  
  // Helper function to copy text to clipboard
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };
  
  // Helper function to truncate signature
  const truncateSignature = (signature: string) => {
    if (!signature) return 'No signature data';
    return `${signature.substring(0, 20)}...${signature.substring(signature.length - 20)}`;
  };
  
  if (safeMessages.length === 0) {
    return (
      <div className="card animate-fade-in">
        <div className="card-header">
          <h2 className="card-title">Message History</h2>
        </div>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-dark-700 mb-2">No signed messages yet</h3>
          <p className="text-dark-500 max-w-sm">
            Sign a message to verify your wallet ownership and see your message history here.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="card animate-fade-in">
      <div className="card-header">
        <h2 className="card-title">Message History</h2>
        <span className="badge badge-info">{safeMessages.length} Message{safeMessages.length !== 1 ? 's' : ''}</span>
      </div>
      
      <div className="space-y-4">
        {safeMessages.map((msg, index) => {
          const isExpanded = expandedMessage === msg.id;
          const dateInfo = formatDate(msg.timestamp || Date.now());
          
          return (
            <div 
              key={msg.id} 
              className={`border border-gray-200 rounded-xl p-4 transition-all duration-200 ${index === 0 ? 'animate-slide-up' : ''}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center">
                  <div className={`h-2 w-2 rounded-full mr-2 ${msg.verified ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span 
                    className="text-sm text-dark-500 hover:text-dark-700 transition-colors cursor-help" 
                    title={dateInfo.fullDate}
                  >
                    {dateInfo.relativeTime}
                  </span>
                </div>
                <div>
                  {msg.verified !== undefined && (
                    <span className={`badge ${msg.verified ? 'badge-success' : 'badge-error'}`}>
                      {msg.verified ? 'Valid' : 'Invalid'}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="mb-3">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-sm font-medium text-dark-700">Message</h3>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-dark-800 break-words text-sm">
                  {msg.message || 'No message content'}
                </div>
              </div>
              
              <div className="mb-3">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-sm font-medium text-dark-700">Signer</h3>
                  <button 
                    onClick={() => copyToClipboard(msg.signer || '', `signer-${msg.id}`)}
                    className="text-xs text-primary-600 hover:text-primary-700 transition-colors flex items-center"
                    title="Copy full address"
                  >
                    {copiedId === `signer-${msg.id}` ? (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Copied
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <div className="bg-gray-50 rounded-lg p-2 font-mono text-xs text-dark-700 flex items-center">
                  <div className="h-5 w-5 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center mr-2 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                  {formatSigner(msg.signer)}
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-sm font-medium text-dark-700">Signature</h3>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => setExpandedMessage(isExpanded ? null : msg.id)}
                      className="text-xs text-primary-600 hover:text-primary-700 transition-colors flex items-center"
                    >
                      {isExpanded ? (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                          Hide
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                          Show
                        </>
                      )}
                    </button>
                    <button 
                      onClick={() => copyToClipboard(msg.signature || '', `sig-${msg.id}`)}
                      className="text-xs text-primary-600 hover:text-primary-700 transition-colors flex items-center"
                      title="Copy signature"
                    >
                      {copiedId === `sig-${msg.id}` ? (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Copied
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-2 font-mono text-xs text-dark-700 overflow-hidden transition-all duration-300">
                  {isExpanded ? (
                    <div className="break-all animate-fade-in">{msg.signature || 'No signature data'}</div>
                  ) : (
                    <div className="truncate">{truncateSignature(msg.signature || '')}</div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MessageHistory;
