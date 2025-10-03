export interface SignedMessage {
    message: string;
    signature: string;
    timestamp: number;
    verified?: boolean;
    signer?: string;
}
export interface VerificationRequest {
    message: string;
    signature: string;
}
export interface VerificationResponse {
    isValid: boolean;
    signer: string;
    originalMessage: string;
}
