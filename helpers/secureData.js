import crypto from 'crypto';

//**AES-256**

//encryption
export const aesEncryption = async (
    plainText,
    key,
    outputEncoding
) => {
    const iv = 'aw90rela942f65u2';
    try {
        const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
        return Buffer.concat([
            cipher.update(plainText),
            cipher.final(),
        ]).toString(outputEncoding);
    } catch (error) {
        console.log(error);
    }
};

//decryption
export const aesDecryption = async (
    cipherText,
    key,
    outputEncoding
) => {
    const iv = 'aw90rela942f65u2';
    const cipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    return Buffer.concat([cipher.update(cipherText, 'base64'), cipher.final()]).toString(
        outputEncoding
    );
};

//**SHA-256**/

const secret = 'abcdefg';

//encryption
export const shaEncryption = async (password) => {
    try {
        const hash = crypto
            .createHash('sha256', secret)
            .update(password)
            .digest('base64');
        return hash;
    } catch (error) {
        console.log(error);
    }
};

//decryption

//call encryption api for input password and match it with password saved in db.
