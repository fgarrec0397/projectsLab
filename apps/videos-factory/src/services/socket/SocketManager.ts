import { io, Socket } from "socket.io-client";

class SocketManager {
    private static instance: SocketManager;

    public socket: Socket;

    private subscribedEvents: Set<string> = new Set();

    private constructor() {
        const endpoint = process.env.NEXT_PUBLIC_CREATEIFY_SERVICE_WEBSOCKET_URL || "";
        this.socket = io(endpoint);
    }

    public static getInstance(): SocketManager {
        if (!SocketManager.instance) {
            SocketManager.instance = new SocketManager();
        }
        return SocketManager.instance;
    }

    public subscribe(event: string, callback: (data: any) => void): void {
        console.log(this.subscribedEvents.has(event), "this.subscribedEvents.has(event)");

        if (!this.subscribedEvents.has(event)) {
            this.socket.on(event, callback);
            this.subscribedEvents.add(event);
        }
    }

    public unsubscribe(event: string, callback: (data: any) => void): void {
        if (this.subscribedEvents.has(event)) {
            this.socket.off(event, callback);
            this.subscribedEvents.delete(event);
        }
    }
}

export default SocketManager.getInstance();
