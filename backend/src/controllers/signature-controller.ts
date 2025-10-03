import { Request, Response } from 'express';
import { ethers } from 'ethers';

interface VerifySignatureRequest {
  message: string;
  signature: string;
}

export const verifySignature = async (req: Request, res: Response) => {
  try {
    const { message, signature } = req.body as VerifySignatureRequest;

    // Validate input
    if (!message || !signature) {
      return res.status(400).json({ 
        error: 'Missing required fields: message and signature are required' 
      });
    }

    // Recover the signer address from the signature
    // We need to hash the message the same way it was hashed for signing
    const messageHash = ethers.hashMessage(message);
    const recoveredAddress = ethers.recoverAddress(messageHash, signature);

    return res.status(200).json({
      isValid: true,
      signer: recoveredAddress,
      originalMessage: message
    });
  } catch (error) {
    console.error('Error verifying signature:', error);
    
    return res.status(400).json({
      isValid: false,
      error: 'Invalid signature',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
