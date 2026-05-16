import crypto from 'crypto'

const SIGNATURE_HEADER_PATTERN = /^t=(\d+),v1=([a-f0-9]{64})$/

export function parseSignatureHeader(header: string): { timestamp: number; signature: string } | null {
  const match = header.match(SIGNATURE_HEADER_PATTERN)
  if (!match) {
    return null
  }
  return {
    timestamp: parseInt(match[1], 10),
    signature: match[2]
  }
}

export function generateSignature(payload: string, secret: string): string {
  return crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex')
}

export function generateTestSignature(payload: string, secret: string, timestamp: number): string {
  const signature = generateSignature(`${timestamp}.${payload}`, secret)
  return `t=${timestamp},v1=${signature}`
}

export function verifyWebhookSignature(
  payload: string,
  signatureHeader: string,
  secret: string,
  tolerance?: number
): boolean {
  const parsed = parseSignatureHeader(signatureHeader)
  if (!parsed) {
    return false
  }

  if (tolerance !== undefined) {
    const now = Math.floor(Date.now() / 1000)
    if (Math.abs(now - parsed.timestamp) > tolerance) {
      return false
    }
  }

  const expectedSignature = generateSignature(`${parsed.timestamp}.${payload}`, secret)

  return crypto.timingSafeEqual(
    Buffer.from(expectedSignature, 'hex'),
    Buffer.from(parsed.signature, 'hex')
  )
}
