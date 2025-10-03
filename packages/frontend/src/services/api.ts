import { VerificationResponse } from '../types/message';

// Use environment variable for API URL with fallback to local proxy
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Verifies a signature with the backend
 * @param message The original message that was signed
 * @param signature The signature to verify
 * @returns A promise that resolves to the verification response
 */
export const verifySignature = async (
  message: string,
  signature: string
): Promise<VerificationResponse> => {
  try {
    // Add a small delay to simulate network latency and ensure UI updates properly
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const response = await fetch(`${API_BASE_URL}/verify-signature`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, signature }),
    });
    
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error verifying signature:', error);
    
    // Return a fallback response in case of network errors
    // This helps prevent the UI from crashing
    if (error instanceof Error && error.message.includes('Failed to fetch')) {
      return {
        isValid: false,
        signer: '',
        originalMessage: message,
        error: 'Network error: Could not connect to the verification service'
      } as VerificationResponse;
    }
    
    throw error;
  }
};
