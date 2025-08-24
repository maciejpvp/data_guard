import { create } from "zustand";
import { WebSocketPayload } from "../../../shared/types";
import { websocketUrl } from "@/constants/ws";

type EventCallbacks = {
  [type: string]: ((payload: any) => void)[];
};

type WebSocketStore = {
  ws: WebSocket | null;
  connected: boolean;
  events: EventCallbacks;
  pingInterval: NodeJS.Timer | null;

  connect: (url: string) => void;
  disconnect: () => void;
  on: (type: string, callback: (payload: any) => void) => void;
  send: (type: string, payload: string) => void;
};

export const useWebSocketStore = create<WebSocketStore>((set, get) => ({
  ws: null,
  connected: false,
  events: {},
  pingInterval: null,

  connect: (url: string) => {
    if (get().ws) return; // już połączony

    const ws = new WebSocket(url);

    ws.onopen = () => {
      set({ connected: true });
      console.log("WebSocket connected");

      //Ping WebSocket Every 7 Minutes.
      const interval = setInterval(
        () => {
          console.log("Ping");
          get().send("ping", Date.now().toString());
        },
        7 * 60 * 1000,
      );

      set({ pingInterval: interval });
    };

    ws.onmessage = (event) => {
      try {
        const data: WebSocketPayload = JSON.parse(event.data);
        console.log(data);
        const callbacks = get().events[data.type] || [];

        callbacks.forEach((cb) => cb(data.payload));
      } catch (err) {
        console.error("Invalid message", err);
      }
    };

    ws.onclose = () => {
      set({ connected: false, ws: null });
      console.log("WebSocket disconnected");
    };

    set({ ws });
  },

  disconnect: () => {
    const ws = get().ws;

    if (ws) {
      ws.close();
      set({ ws: null, connected: false });
    }
  },

  on: (type: string, callback: (payload: any) => void) => {
    const events = { ...get().events };

    if (!events[type]) events[type] = [];
    events[type].push(callback);
    set({ events });
  },

  send: (type: string, payload: any) => {
    const ws = get().ws;

    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type, payload }));
    }
  },
}));
