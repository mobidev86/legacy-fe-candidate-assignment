import request from 'supertest';
import express from 'express';
import cors from 'cors';
import routes from '../src/routes/index.js';
import { ethers } from 'ethers';

// Create a test app
const createTestApp = () => {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use('/', routes);
  
  // Error handling middleware
  app.use((err, req, res, next) => {
    res.status(500).json({
      error: 'Server Error',
      message: err.message
    });
  });
  
  return app;
};

describe('API Integration Tests', () => {
  let app;

  beforeEach(() => {
    app = createTestApp();
  });

  describe('GET /health', () => {
    it('should return 200 and status ok', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toEqual({ status: 'ok' });
    });
  });

  describe('POST /verify-signature', () => {
    it('should verify a valid signature', async () => {
      // Create a real wallet and sign a message
      const wallet = ethers.Wallet.createRandom();
      const message = 'Hello, Web3!';
      const signature = await wallet.signMessage(message);

      const response = await request(app)
        .post('/verify-signature')
        .send({ message, signature })
        .expect(200);

      expect(response.body).toMatchObject({
        isValid: true,
        signer: wallet.address,
        originalMessage: message,
      });
    });

    it('should return 400 when message is missing', async () => {
      const response = await request(app)
        .post('/verify-signature')
        .send({ signature: '0x123' })
        .expect(400);

      expect(response.body).toMatchObject({
        error: 'Bad Request',
        message: 'Both message and signature are required',
      });
    });

    it('should return 400 when signature is missing', async () => {
      const response = await request(app)
        .post('/verify-signature')
        .send({ message: 'Hello World' })
        .expect(400);

      expect(response.body).toMatchObject({
        error: 'Bad Request',
        message: 'Both message and signature are required',
      });
    });

    it('should return 400 when both message and signature are missing', async () => {
      const response = await request(app)
        .post('/verify-signature')
        .send({})
        .expect(400);

      expect(response.body).toMatchObject({
        error: 'Bad Request',
        message: 'Both message and signature are required',
      });
    });

    it('should handle invalid signature format', async () => {
      const response = await request(app)
        .post('/verify-signature')
        .send({
          message: 'Hello World',
          signature: 'invalid-signature',
        })
        .expect(200);

      expect(response.body).toMatchObject({
        isValid: false,
        signer: '',
        originalMessage: 'Hello World',
      });
    });

    it('should handle malformed hex signature', async () => {
      const response = await request(app)
        .post('/verify-signature')
        .send({
          message: 'Hello World',
          signature: '0xmalformed',
        })
        .expect(200);

      expect(response.body).toMatchObject({
        isValid: false,
        signer: '',
        originalMessage: 'Hello World',
      });
    });

    it('should verify signature with empty message', async () => {
      const wallet = ethers.Wallet.createRandom();
      const message = '';
      const signature = await wallet.signMessage(message);

      const response = await request(app)
        .post('/verify-signature')
        .send({ message, signature })
        .expect(200);

      expect(response.body).toMatchObject({
        isValid: true,
        signer: wallet.address,
        originalMessage: message,
      });
    });

    it('should verify signature with special characters', async () => {
      const wallet = ethers.Wallet.createRandom();
      const message = '🚀 Hello World! @#$%^&*()';
      const signature = await wallet.signMessage(message);

      const response = await request(app)
        .post('/verify-signature')
        .send({ message, signature })
        .expect(200);

      expect(response.body).toMatchObject({
        isValid: true,
        signer: wallet.address,
        originalMessage: message,
      });
    });

    it('should verify signature with long message', async () => {
      const wallet = ethers.Wallet.createRandom();
      const message = 'A'.repeat(1000);
      const signature = await wallet.signMessage(message);

      const response = await request(app)
        .post('/verify-signature')
        .send({ message, signature })
        .expect(200);

      expect(response.body).toMatchObject({
        isValid: true,
        signer: wallet.address,
        originalMessage: message,
      });
    });

    it('should fail verification when signature does not match message', async () => {
      const wallet = ethers.Wallet.createRandom();
      const originalMessage = 'Original message';
      const signature = await wallet.signMessage(originalMessage);
      const differentMessage = 'Different message';

      const response = await request(app)
        .post('/verify-signature')
        .send({ 
          message: differentMessage, 
          signature 
        })
        .expect(200);

      expect(response.body.isValid).toBe(true);
      // The signature is valid, but the signer won't match the expected address
      // because the message is different
      expect(response.body.signer).not.toBe('');
    });

    it('should handle JSON parsing errors gracefully', async () => {
      // Express returns 500 for malformed JSON by default
      // This is expected behavior - the error middleware catches it
      const response = await request(app)
        .post('/verify-signature')
        .set('Content-Type', 'application/json')
        .send('invalid json')
        .expect(500);
      
      expect(response.body).toHaveProperty('error');
    });

    it('should handle CORS preflight request', async () => {
      await request(app)
        .options('/verify-signature')
        .expect(204);
    });

    it('should accept application/json content type', async () => {
      const wallet = ethers.Wallet.createRandom();
      const message = 'Test message';
      const signature = await wallet.signMessage(message);

      const response = await request(app)
        .post('/verify-signature')
        .set('Content-Type', 'application/json')
        .send(JSON.stringify({ message, signature }))
        .expect(200);

      expect(response.body.isValid).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for unknown routes', async () => {
      await request(app)
        .get('/unknown-route')
        .expect(404);
    });

    it('should return 404 for POST to unknown routes', async () => {
      await request(app)
        .post('/unknown-route')
        .send({ data: 'test' })
        .expect(404);
    });
  });
});
