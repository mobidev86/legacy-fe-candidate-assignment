import express from 'express';
import { verifySignature } from '../controllers/signature-controller';

const router = express.Router();

router.post('/', verifySignature);

export { router as verifySignatureRouter };
