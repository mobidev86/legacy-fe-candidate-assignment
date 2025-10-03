import { SignedMessage, VerificationResponse } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export const verifySignature = async (message: string, signature: string): Promise<VerificationResponse> => {
  try {
    const response = await fetch(`${API_URL}/verify-signature`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, signature }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to verify signature');
    }

    return await response.json();
  } catch (error) {
    console.error('Error verifying signature:', error);
    throw error;
  }
};
