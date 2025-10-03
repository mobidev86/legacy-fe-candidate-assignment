import { Request, Response } from 'express';
import { verifySignature } from './signature-controller';

// Mock ethers library
jest.mock('ethers', () => ({
  hashMessage: jest.fn().mockReturnValue('0xmockedHash'),
  recoverAddress: jest.fn().mockReturnValue('0x1234567890abcdef1234567890abcdef12345678'),
}));

describe('Signature Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    mockRequest = {
      body: {
        message: 'Test message',
        signature: '0xsignature',
      },
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jsonMock,
    };
  });

  it('should verify a valid signature', async () => {
    await verifySignature(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({
      isValid: true,
      signer: '0x1234567890abcdef1234567890abcdef12345678',
      originalMessage: 'Test message',
    });
  });

  it('should return 400 if message is missing', async () => {
    mockRequest.body = { signature: '0xsignature' };

    await verifySignature(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      error: 'Missing required fields: message and signature are required',
    });
  });

  it('should return 400 if signature is missing', async () => {
    mockRequest.body = { message: 'Test message' };

    await verifySignature(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      error: 'Missing required fields: message and signature are required',
    });
  });

  it('should handle errors during verification', async () => {
    const ethers = require('ethers');
    ethers.recoverAddress.mockImplementationOnce(() => {
      throw new Error('Invalid signature');
    });

    await verifySignature(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      isValid: false,
      error: 'Invalid signature',
      message: 'Invalid signature',
    });
  });
});
