/// <reference types="vite/client" />

// Declare modules to fix TypeScript import errors
declare module '../components/MessageForm' {
  import { SignedMessage } from '../types/message';
  
  interface MessageFormProps {
    addToHistory: (message: SignedMessage) => void;
  }
  
  const MessageForm: React.FC<MessageFormProps>;
  export default MessageForm;
}

declare module '../components/MessageHistory' {
  import { SignedMessage } from '../types/message';
  
  interface MessageHistoryProps {
    messages: SignedMessage[];
  }
  
  const MessageHistory: React.FC<MessageHistoryProps>;
  export default MessageHistory;
}

declare module '../services/api' {
  import { VerificationResponse } from '../types/message';
  
  export const verifySignature: (
    message: string,
    signature: string
  ) => Promise<VerificationResponse>;
}
