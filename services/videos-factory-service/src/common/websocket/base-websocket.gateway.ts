import {
    ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway({
    cors: {
        origin: "*",
    },
})
export class BaseWebSocketGateway {
    @WebSocketServer()
    server: Server;

    @SubscribeMessage("connectUser")
    handleConnectUser(@MessageBody() data: { userId: string }, @ConnectedSocket() client: Socket) {
        const { userId } = data;

        client.join(userId);

        console.log(`Client ${client.id} joined room ${userId}`);
    }

    @SubscribeMessage("disconnectUser")
    handleDisconnectConnectUser(
        @MessageBody() data: { userId: string },
        @ConnectedSocket() client: Socket
    ) {
        const { userId } = data;

        client.leave(userId);

        console.log(`Client ${client.id} joined room ${userId}`);
    }

    broadcastAll(event: string, data: any) {
        this.server.emit(event, data);
    }

    broadcastRoom<TData>(event: string, roomId: string, data: TData) {
        console.log(`Broadcast ${event} to room ${roomId} ${data} data`);

        this.server.to(roomId).emit(event, data);
    }
}
