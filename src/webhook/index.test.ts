import { describe, it, expect, vi } from 'vitest'
import { webhookHandler } from './index.js'
import { WebhookHandler } from '../services/webhook-handler.js'
import { generateTestSignature } from '../utils/verify-webhook.js'
import { IncomingMessage, ServerResponse } from 'http'

const TEST_SECRET = 'test-secret-key-12345'
const TEST_PAYLOAD = JSON.stringify({ type: 'test.event', data: 'hello world' })
const TEST_TIMESTAMP = 1730000000

describe('webhookHandler', () => {
  it('should return 200 OK for valid request', async () => {
    const webhookHandlerInstance = new WebhookHandler()
    const handler = vi.fn()
    webhookHandlerInstance.registerHandler('test.event', handler)

    const req = {
      headers: {
        'x-oasiswaker-signature': generateTestSignature(TEST_PAYLOAD, TEST_SECRET, TEST_TIMESTAMP)
      },
      [Symbol.asyncIterator]: async function* () {
        yield Buffer.from(TEST_PAYLOAD)
      }
    } as unknown as IncomingMessage

    const res = {
      statusCode: 0,
      end: vi.fn()
    } as unknown as ServerResponse

    await webhookHandler(req, res, {
      secret: TEST_SECRET,
      webhookHandler: webhookHandlerInstance
    })

    expect(res.statusCode).toBe(200)
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('should return 401 Unauthorized for missing signature', async () => {
    const webhookHandlerInstance = new WebhookHandler()

    const req = {
      headers: {},
      [Symbol.asyncIterator]: async function* () {
        yield Buffer.from(TEST_PAYLOAD)
      }
    } as unknown as IncomingMessage

    const res = {
      statusCode: 0,
      end: vi.fn()
    } as unknown as ServerResponse

    await webhookHandler(req, res, {
      secret: TEST_SECRET,
      webhookHandler: webhookHandlerInstance
    })

    expect(res.statusCode).toBe(401)
  })

  it('should return 401 Unauthorized for invalid signature', async () => {
    const webhookHandlerInstance = new WebhookHandler()

    const req = {
      headers: {
        'x-oasiswaker-signature': 't=1730000000,v1=0000000000000000000000000000000000000000000000000000000000000000'
      },
      [Symbol.asyncIterator]: async function* () {
        yield Buffer.from(TEST_PAYLOAD)
      }
    } as unknown as IncomingMessage

    const res = {
      statusCode: 0,
      end: vi.fn()
    } as unknown as ServerResponse

    await webhookHandler(req, res, {
      secret: TEST_SECRET,
      webhookHandler: webhookHandlerInstance
    })

    expect(res.statusCode).toBe(401)
  })

  it('should return 400 Bad Request for invalid JSON', async () => {
    const webhookHandlerInstance = new WebhookHandler()
    const invalidPayload = 'invalid json'

    const req = {
      headers: {
        'x-oasiswaker-signature': generateTestSignature(invalidPayload, TEST_SECRET, TEST_TIMESTAMP)
      },
      [Symbol.asyncIterator]: async function* () {
        yield Buffer.from(invalidPayload)
      }
    } as unknown as IncomingMessage

    const res = {
      statusCode: 0,
      end: vi.fn()
    } as unknown as ServerResponse

    await webhookHandler(req, res, {
      secret: TEST_SECRET,
      webhookHandler: webhookHandlerInstance
    })

    expect(res.statusCode).toBe(400)
  })
})
