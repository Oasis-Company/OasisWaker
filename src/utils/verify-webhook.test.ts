import { describe, it, expect } from 'vitest'
import { parseSignatureHeader, generateSignature, generateTestSignature, verifyWebhookSignature } from './verify-webhook.js'

const TEST_SECRET = 'test-secret-key-12345'
const TEST_PAYLOAD = JSON.stringify({ event: 'test', data: 'hello world' })
const TEST_TIMESTAMP = 1730000000

describe('verify-webhook', () => {
  describe('parseSignatureHeader', () => {
    it('should parse valid signature header', () => {
      const header = generateTestSignature(TEST_PAYLOAD, TEST_SECRET, TEST_TIMESTAMP)
      const result = parseSignatureHeader(header)
      expect(result).not.toBeNull()
      expect(result?.timestamp).toBe(TEST_TIMESTAMP)
      expect(result?.signature).toBeDefined()
    })

    it('should return null for invalid signature format', () => {
      expect(parseSignatureHeader('invalid')).toBeNull()
      expect(parseSignatureHeader('t=123,wrong=abc')).toBeNull()
      expect(parseSignatureHeader('t=abc,v1=def')).toBeNull()
    })
  })

  describe('verifyWebhookSignature', () => {
    it('should pass verification with valid signature', () => {
      const header = generateTestSignature(TEST_PAYLOAD, TEST_SECRET, TEST_TIMESTAMP)
      const result = verifyWebhookSignature(TEST_PAYLOAD, header, TEST_SECRET)
      expect(result).toBe(true)
    })

    it('should fail verification with invalid signature', () => {
      const header = 't=1730000000,v1=0000000000000000000000000000000000000000000000000000000000000000'
      const result = verifyWebhookSignature(TEST_PAYLOAD, header, TEST_SECRET)
      expect(result).toBe(false)
    })

    it('should fail verification with tampered payload', () => {
      const header = generateTestSignature(TEST_PAYLOAD, TEST_SECRET, TEST_TIMESTAMP)
      const tamperedPayload = JSON.stringify({ event: 'test', data: 'tampered' })
      const result = verifyWebhookSignature(tamperedPayload, header, TEST_SECRET)
      expect(result).toBe(false)
    })

    it('should fail verification with missing signature header', () => {
      const result = verifyWebhookSignature(TEST_PAYLOAD, '', TEST_SECRET)
      expect(result).toBe(false)
    })

    it('should fail verification with invalid signature format', () => {
      const result = verifyWebhookSignature(TEST_PAYLOAD, 'invalid-format', TEST_SECRET)
      expect(result).toBe(false)
    })

    it('should fail verification with timestamp outside tolerance', () => {
      const oldTimestamp = Math.floor(Date.now() / 1000) - 600 // 10 minutes ago
      const header = generateTestSignature(TEST_PAYLOAD, TEST_SECRET, oldTimestamp)
      const result = verifyWebhookSignature(TEST_PAYLOAD, header, TEST_SECRET, 300) // 5 minute tolerance
      expect(result).toBe(false)
    })

    it('should pass verification with timestamp within tolerance', () => {
      const now = Math.floor(Date.now() / 1000)
      const header = generateTestSignature(TEST_PAYLOAD, TEST_SECRET, now)
      const result = verifyWebhookSignature(TEST_PAYLOAD, header, TEST_SECRET, 300)
      expect(result).toBe(true)
    })
  })
})
