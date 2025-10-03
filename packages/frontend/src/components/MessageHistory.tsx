import { SignedMessage } from '../types/message';

interface MessageHistoryProps {
  messages: SignedMessage[];
}

const MessageHistory = ({ messages }: MessageHistoryProps) => {
  if (messages.length === 0) {
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
    return new Date(timestamp).toLocaleString();
  };
  
  const shortenAddress = (address: string) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">Message History</h2>
      
      <div className="space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className="border rounded-md p-3">
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm text-gray-500">{formatDate(msg.timestamp)}</span>
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
              <p className="text-gray-800 break-words">{msg.message}</p>
            </div>
            
            {msg.signer && (
              <div className="mb-2">
                <h3 className="font-medium text-sm">Signer:</h3>
                <p className="text-xs font-mono break-all">{msg.signer}</p>
              </div>
            )}
            
            <div>
              <h3 className="font-medium text-sm">Signature:</h3>
              <p className="text-xs font-mono break-all">{msg.signature}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessageHistory;
