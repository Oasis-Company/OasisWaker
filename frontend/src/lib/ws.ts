const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? "ws://127.0.0.1:8000/ws/v1/events";

export type EventHandler = (event: { type: string; data: unknown }) => void;

export class WsClient {
  private ws: WebSocket | null = null;
  private handlers = new Set<EventHandler>();
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private shouldReconnect = true;

  connect() {
    if (this.ws?.readyState === WebSocket.OPEN) return;

    this.shouldReconnect = true;
    this.ws = new WebSocket(WS_URL);

    this.ws.onopen = () => {
      console.log("[WS] Connected");
    };

    this.ws.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data as string);
        this.handlers.forEach((fn) => fn(parsed));
      } catch {
        console.warn("[WS] Failed to parse message");
      }
    };

    this.ws.onclose = () => {
      console.log("[WS] Disconnected");
      this.scheduleReconnect();
    };

    this.ws.onerror = () => {
      this.ws?.close();
    };
  }

  disconnect() {
    this.shouldReconnect = false;
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.ws?.close();
    this.ws = null;
  }

  onEvent(handler: EventHandler) {
    this.handlers.add(handler);
    return () => this.handlers.delete(handler);
  }

  private scheduleReconnect() {
    if (!this.shouldReconnect) return;
    this.reconnectTimer = setTimeout(() => this.connect(), 3000);
  }
}

export const wsClient = new WsClient();