import crypto from 'crypto';
import { shaEncryption } from './secureData.js';

export const encryptIt = async (req, res) => {
    const { password } = req.body;
    try {
        const hash = await shaEncryption(password);
        res.status(200).json(hash);
    } catch (error) {
        console.log(error);
    }
};

export const compareEncryptedPassword = async (req, res) => {
    const { data } = req.body;
    const pass = 'SA7yHVN1TkxdJkx84lufu/piGeOCUW2cRN2h34YPoks='; // password saved into db
    try {
        var passHash = await shaEncryption(data);
        res.send(pass === passHash);
    } catch (error) {
        console.log(error);
    }
};
