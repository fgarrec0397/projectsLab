import { SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";

@WebSocketGateway({
    cors: {
        origin: "*",
    },
})
export class BaseWebSocketGateway {
    @WebSocketServer()
    server: Server;

    @SubscribeMessage("message")
    handleMessage(data: string): void {
        this.server.emit("message", data);
    }

    broadcast(event: string, data: any) {
        this.server.emit(event, data);
    }
}
