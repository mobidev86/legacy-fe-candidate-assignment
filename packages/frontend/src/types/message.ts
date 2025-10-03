export interface SignedMessage {
  id: string;
  message: string;
  signature: string;
  timestamp: number;
  verified?: boolean;
  signer?: string;
}

export interface VerificationResponse {
  isValid: boolean;
  signer: string;
  originalMessage: string;
}
