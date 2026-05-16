import { describe, it, expect, vi } from 'vitest'
import { WebhookHandler, WebhookEvent } from './webhook-handler.js'

describe('WebhookHandler', () => {
  describe('registerHandler and handleEvent', () => {
    it('should register and call a custom handler', async () => {
      const handler = vi.fn()
      const webhookHandler = new WebhookHandler()
      const testEvent: WebhookEvent = { type: 'test.event', data: { message: 'hello' } }

      webhookHandler.registerHandler('test.event', handler)
      await webhookHandler.handleEvent(testEvent)

      expect(handler).toHaveBeenCalledTimes(1)
      expect(handler).toHaveBeenCalledWith(testEvent)
    })

    it('should call multiple handlers for the same event', async () => {
      const handler1 = vi.fn()
      const handler2 = vi.fn()
      const webhookHandler = new WebhookHandler()
      const testEvent: WebhookEvent = { type: 'test.event', data: { message: 'hello' } }

      webhookHandler.registerHandler('test.event', handler1)
      webhookHandler.registerHandler('test.event', handler2)
      await webhookHandler.handleEvent(testEvent)

      expect(handler1).toHaveBeenCalledTimes(1)
      expect(handler2).toHaveBeenCalledTimes(1)
      expect(handler1).toHaveBeenCalledWith(testEvent)
      expect(handler2).toHaveBeenCalledWith(testEvent)
    })

    it('should not call handlers for different event types', async () => {
      const handler = vi.fn()
      const webhookHandler = new WebhookHandler()
      const testEvent: WebhookEvent = { type: 'other.event', data: { message: 'hello' } }

      webhookHandler.registerHandler('test.event', handler)
      await webhookHandler.handleEvent(testEvent)

      expect(handler).not.toHaveBeenCalled()
    })

    it('should handle async handlers', async () => {
      const asyncHandler = vi.fn().mockResolvedValue(undefined)
      const webhookHandler = new WebhookHandler()
      const testEvent: WebhookEvent = { type: 'test.event', data: { message: 'hello' } }

      webhookHandler.registerHandler('test.event', asyncHandler)
      await webhookHandler.handleEvent(testEvent)

      expect(asyncHandler).toHaveBeenCalledTimes(1)
      expect(asyncHandler).toHaveBeenCalledWith(testEvent)
    })
  })
})
