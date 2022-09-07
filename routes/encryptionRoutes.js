import express from 'express';
import { encryptDetails, decryptDetails } from '../helpers/Aes-256.js';
import { compareEncryptedPassword, encryptIt } from '../helpers/SHA-256.js';

const router = express.Router();

router.post('/aes-encrypt', encryptDetails);
router.post('/aes-decrypt', decryptDetails);

router.post('/sha-encrypt', encryptIt);
router.post('/sha-decrypt', compareEncryptedPassword);

export default router;
