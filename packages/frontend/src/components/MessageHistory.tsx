import { SignedMessageType } from '../context/DynamicContext';

interface MessageHistoryProps {
  messages: SignedMessageType[];
}

const MessageHistory = ({ messages = [] }: MessageHistoryProps) => {
  // Ensure messages is an array
  const safeMessages = Array.isArray(messages) ? messages : [];
  if (safeMessages.length === 0) {
    return (
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Message History</h2>
        <p className="text-gray-500 text-center py-4">
          No signed messages yet. Sign a message to see it here.
        </p>
      </div>
    );
  }
  
  const formatDate = (timestamp: number) => {
    try {
      return new Date(timestamp).toLocaleString();
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };
  
  // Helper function to safely display signer addresses
  const formatSigner = (signer: string | undefined | null) => {
    if (!signer || typeof signer !== 'string') return 'Unknown';
    return signer;
  };
  
  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">Message History</h2>
      
      <div className="space-y-4">
        {safeMessages.map((msg) => (
          <div key={msg.id} className="border rounded-md p-3">
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm text-gray-500">{formatDate(msg.timestamp || Date.now())}</span>
              {msg.verified !== undefined && (
                <span 
                  className={`text-xs px-2 py-1 rounded-full ${
                    msg.verified 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {msg.verified ? 'Valid' : 'Invalid'}
                </span>
              )}
            </div>
            
            <div className="mb-2">
              <h3 className="font-medium">Message:</h3>
              <p className="text-gray-800 break-words">{msg.message || 'No message content'}</p>
            </div>
            
            <div className="mb-2">
              <h3 className="font-medium text-sm">Signer:</h3>
              <p className="text-xs font-mono break-all">{formatSigner(msg.signer)}</p>
            </div>
            
            <div>
              <h3 className="font-medium text-sm">Signature:</h3>
              <p className="text-xs font-mono break-all">{msg.signature || 'No signature data'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessageHistory;
