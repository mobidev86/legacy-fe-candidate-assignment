import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { verifySignature } from '../api';

describe('API Service', () => {
  beforeEach(() => {
    // Mock fetch
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('verifySignature', () => {
    it('should successfully verify a valid signature', async () => {
      const mockResponse = {
        isValid: true,
        signer: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0',
        originalMessage: 'Hello World',
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await verifySignature('Hello World', '0xabc123');

      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/verify-signature'),
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: 'Hello World',
            signature: '0xabc123',
          }),
        })
      );
    });

    it('should handle invalid signature response', async () => {
      const mockResponse = {
        isValid: false,
        signer: '',
        originalMessage: 'Hello World',
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await verifySignature('Hello World', 'invalid-sig');

      expect(result).toEqual(mockResponse);
    });

    it('should throw error on server error response', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(verifySignature('Hello World', '0xabc123')).rejects.toThrow(
        'Server responded with status: 500'
      );
    });

    it('should handle network errors gracefully', async () => {
      (global.fetch as any).mockRejectedValueOnce(new Error('Failed to fetch'));

      const result = await verifySignature('Hello World', '0xabc123');

      expect(result).toEqual({
        isValid: false,
        signer: '',
        originalMessage: 'Hello World',
        error: 'Network error: Could not connect to the verification service',
      });
    });

    it('should handle empty message', async () => {
      const mockResponse = {
        isValid: true,
        signer: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0',
        originalMessage: '',
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await verifySignature('', '0xabc123');

      expect(result).toEqual(mockResponse);
    });

    it('should handle special characters in message', async () => {
      const message = '🚀 Hello World! @#$%^&*()';
      const mockResponse = {
        isValid: true,
        signer: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0',
        originalMessage: message,
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await verifySignature(message, '0xabc123');

      expect(result).toEqual(mockResponse);
    });

    it('should add delay for network simulation', async () => {
      const mockResponse = {
        isValid: true,
        signer: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0',
        originalMessage: 'Test',
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const startTime = Date.now();
      await verifySignature('Test', '0xabc123');
      const endTime = Date.now();

      // Should take at least 300ms due to the delay
      expect(endTime - startTime).toBeGreaterThanOrEqual(300);
    });
  });
});
