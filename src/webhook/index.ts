import { IncomingMessage, ServerResponse } from 'http'
import { verifyWebhookSignature } from '../utils/verify-webhook.js'
import { WebhookHandler, WebhookEvent } from '../services/webhook-handler.js'

export interface WebhookHandlerOptions {
  secret: string
  tolerance?: number
  webhookHandler: WebhookHandler
}

export async function webhookHandler(
  req: IncomingMessage,
  res: ServerResponse,
  options: WebhookHandlerOptions
): Promise<void> {
  try {
    let body = ''
    for await (const chunk of req) {
      body += chunk
    }

    const signatureHeader = req.headers['x-oasiswaker-signature'] as string
    if (!signatureHeader) {
      res.statusCode = 401
      res.end(JSON.stringify({ error: 'Missing signature header' }))
      return
    }

    const isValid = verifyWebhookSignature(
      body,
      signatureHeader,
      options.secret,
      options.tolerance
    )

    if (!isValid) {
      res.statusCode = 401
      res.end(JSON.stringify({ error: 'Invalid signature' }))
      return
    }

    let event: WebhookEvent
    try {
      event = JSON.parse(body)
    } catch (parseError) {
      res.statusCode = 400
      res.end(JSON.stringify({ error: 'Invalid JSON' }))
      return
    }

    await options.webhookHandler.handleEvent(event)

    res.statusCode = 200
    res.end(JSON.stringify({ success: true }))
  } catch (error) {
    res.statusCode = 500
    res.end(JSON.stringify({ error: 'Internal server error' }))
  }
}
