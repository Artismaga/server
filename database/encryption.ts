import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

const SECRET = process.env.DATABASE_SECRET || 'insecure_secret';
const ALGORITHM = 'aes-256-cbc';

if (SECRET === 'insecure_secret') {
    console.warn('WARNING: No database secret set. If this is a production environment, please set a secure secret.');
}

export function isSecure() {
    return SECRET !== 'insecure_secret';
}

export function encrypt(text: string) {
    const iv = randomBytes(16);
    const cipher = createCipheriv(ALGORITHM, SECRET, iv);
    const encrypted = cipher.update(text, 'utf8', 'hex');
    return [
        encrypted + cipher.final('hex'),
        Buffer.from(iv).toString('hex'),
    ].join('|');
}

export function decrypt(text: string) {
    const [encrypted, iv] = text.split('|');
    const decipher = createDecipheriv(ALGORITHM, SECRET, Buffer.from(iv, 'hex'));
    return decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');
}