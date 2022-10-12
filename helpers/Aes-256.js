import crypto from 'crypto';

import { aesEncryption, aesDecryption } from './secureData.js';

let key = 'jgkw58kt3kl47er15558tdsbwm5235po';
export const encryptDetails = async (req, res) => {
    const data = req.body;
    try {
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
        const decrypted = await aesDecryption(
            Buffer.from(data, 'base64'),
            key,
            'utf8'
        );
        console.log(decrypted)
        res.status(200).json(decrypted);
    } catch (error) {
        console.log(error);
    }
};
