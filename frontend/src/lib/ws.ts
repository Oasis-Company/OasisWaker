const WS_URL =
  process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:8000/ws/v1/events";

export type EventHandler = (event: { type: string; data: unknown }) => void;
export type WsConnectionStatus = "connecting" | "connected" | "disconnected";

export class WsClient {
  private ws: WebSocket | null = null;
  private handlers = new Set<EventHandler>();
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private shouldReconnect = true;
  private reconnectAttempts = 0;
  private status: WsConnectionStatus = "disconnected";
  private statusListeners = new Set<(s: WsConnectionStatus) => void>();

  private setStatus(s: WsConnectionStatus) {
    this.status = s;
    this.statusListeners.forEach((fn) => fn(s));
  }

  getConnectionStatus(): WsConnectionStatus {
    return this.status;
  }

  onStatusChange(cb: (s: WsConnectionStatus) => void) {
    this.statusListeners.add(cb);
    return () => this.statusListeners.delete(cb);
  }

  connect() {
    if (this.ws?.readyState === WebSocket.OPEN) return;

    this.shouldReconnect = true;
    this.setStatus("connecting");
    this.ws = new WebSocket(WS_URL);

    this.ws.onopen = () => {
      this.reconnectAttempts = 0;
      this.setStatus("connected");
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
      this.setStatus("disconnected");
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
    this.setStatus("disconnected");
  }

  onEvent(handler: EventHandler) {
    this.handlers.add(handler);
    return () => this.handlers.delete(handler);
  }

  private scheduleReconnect() {
    if (!this.shouldReconnect) return;
    const delay = Math.min(
      1000 * Math.pow(2, this.reconnectAttempts),
      30000
    );
    this.reconnectAttempts++;
    this.reconnectTimer = setTimeout(() => this.connect(), delay);
  }
}

export const wsClient = new WsClient();