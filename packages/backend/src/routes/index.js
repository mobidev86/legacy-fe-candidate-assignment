import express from 'express';
import { verifySignature } from '../controllers/signatureController.js';

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Signature verification endpoint
router.post('/verify-signature', verifySignature);

export default router;
