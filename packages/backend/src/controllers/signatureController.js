import { ethers } from 'ethers';

/**
 * Verifies an Ethereum signature
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const verifySignature = async (req, res, next) => {
  try {
    const { message, signature } = req.body;
    
    // Validate request body - check for undefined/null, but allow empty strings
    if (message === undefined || message === null || signature === undefined || signature === null) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Both message and signature are required'
      });
    }
    
    // Verify the signature using ethers.js
    let signer;
    let isValid = false;
    
    try {
      // Recover the signer address from the signature
      signer = ethers.verifyMessage(message, signature);
      isValid = true;
    } catch (error) {
      isValid = false;
      signer = '';
    }
    
    // Return the verification result
    return res.status(200).json({
      isValid,
      signer: signer || '',
      originalMessage: message
    });
  } catch (error) {
    next(error);
  }
};
