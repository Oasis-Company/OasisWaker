export interface WebhookEvent {
  type: string
  data: unknown
  timestamp?: number
}

export interface WebhookEventHandler {
  (event: WebhookEvent): void | Promise<void>
}

export class WebhookHandler {
  private handlers: Map<string, WebhookEventHandler[]> = new Map()

  registerHandler(eventType: string, handler: WebhookEventHandler): void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, [])
    }
    this.handlers.get(eventType)!.push(handler)
  }

  async handleEvent(event: WebhookEvent): Promise<void> {
    const eventHandlers = this.handlers.get(event.type) || []
    for (const handler of eventHandlers) {
      await handler(event)
    }
  }
}
