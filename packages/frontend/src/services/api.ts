import { VerificationResponse } from '../types/message';

const API_BASE_URL = '/api';

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
    
    return await response.json();
  } catch (error) {
    console.error('Error verifying signature:', error);
    throw error;
  }
};
