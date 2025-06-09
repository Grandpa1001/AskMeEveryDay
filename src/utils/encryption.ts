import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY;

if (!ENCRYPTION_KEY) {
  throw new Error('Brak klucza szyfrowania w zmiennych środowiskowych (VITE_ENCRYPTION_KEY)');
}

export const encrypt = (text: string): string => {
  return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
};

export const decrypt = (encryptedText: string): string => {
  const bytes = CryptoJS.AES.decrypt(encryptedText, ENCRYPTION_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}; 