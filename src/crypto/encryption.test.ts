import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { encrypt, decrypt, generateMasterKey, isEncryptedData } from '../crypto/encryption.js';

describe('Encryption', () => {
  describe('generateMasterKey', () => {
    it('should generate a non-empty string', () => {
      const key = generateMasterKey();
      expect(typeof key).toBe('string');
      expect(key.length).toBeGreaterThan(0);
    });

    it('should generate unique keys', () => {
      const key1 = generateMasterKey();
      const key2 = generateMasterKey();
      expect(key1).not.toBe(key2);
    });
  });

  describe('encrypt and decrypt', () => {
    const testKey = generateMasterKey();

    it('should encrypt and decrypt successfully', () => {
      const plainText = 'Hello, OasisWaker!';
      const encrypted = encrypt(plainText, testKey);
      const decrypted = decrypt(encrypted, testKey);
      expect(decrypted).toBe(plainText);
    });

    it('should produce different outputs for same input', () => {
      const plainText = 'Test string';
      const encrypted1 = encrypt(plainText, testKey);
      const encrypted2 = encrypt(plainText, testKey);
      expect(encrypted1).not.toBe(encrypted2);
    });

    it('should fail to decrypt with wrong key', () => {
      const plainText = 'Secret message';
      const encrypted = encrypt(plainText, testKey);
      const wrongKey = generateMasterKey();
      expect(() => decrypt(encrypted, wrongKey)).toThrow();
    });
  });

  describe('isEncryptedData', () => {
    it('should return true for valid encrypted data', () => {
      const key = generateMasterKey();
      const encrypted = encrypt('test', key);
      expect(isEncryptedData(encrypted)).toBe(true);
    });

    it('should return false for plain text', () => {
      expect(isEncryptedData('just plain text')).toBe(false);
      expect(isEncryptedData('')).toBe(false);
      expect(isEncryptedData('{ "some": "json" }')).toBe(false);
    });
  });
});
