import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_CREATEIFY_SERVICE_WEBSOCKET_URL || ""; // Update with your server's URL

export const socket = io(SOCKET_URL, {
    autoConnect: false,
});
