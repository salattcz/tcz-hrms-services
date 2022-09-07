import crypto from 'crypto';

import { aesEncryption, aesDecryption } from './secureData.js';

export const encryptDetails = async (req, res) => {
    const data = req.body;
    try {
        const key = '1000060000000000';
        const encrypted = await aesEncryption(
            JSON.stringify(data),
            key,
            'base64'
        );
        res.status(200).json(encrypted);
    } catch (error) {
        console.log(error);
    }
};

export const decryptDetails = async (req, res) => {
    const { data } = req.body;
    try {
        const key = '1000060000000000';
        const decrypted = await aesDecryption(
            Buffer.from(data, 'base64'),
            key,
            'utf8'
        );
        res.status(200).json(decrypted);
    } catch (error) {
        console.log(error);
    }
};
