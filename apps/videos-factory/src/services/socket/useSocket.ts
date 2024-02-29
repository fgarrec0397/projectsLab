import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

// Define the URL of your WebSocket server
const SOCKET_URL = process.env.NEXT_PUBLIC_CREATEIFY_SERVICE_WEBSOCKET_URL || ""; // Update with your server's URL

interface UseSocketOptions {
    onConnect?: () => void;
    onDisconnect?: (reason: string) => void;
    onMessage?: (message: any) => void;
}

export const useSocket = (options?: UseSocketOptions) => {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        // Connect to WebSocket server
        const socketIo = io(SOCKET_URL);

        // Connection established
        socketIo.on("connect", () => {
            console.log("Connected to WebSocket server");
            options?.onConnect?.();
        });

        // Listen for messages from the server
        // if (options?.onMessage) {
        // }
        socketIo.on("videoProcessingSteps", (message: any) => {
            console.log(message, "message");
        });

        // Handle disconnection
        socketIo.on("disconnect", (reason) => {
            console.log(`Disconnected: ${reason}`);
            options?.onDisconnect?.(reason);
        });

        // Update the state with the connected socket
        setSocket(socketIo);

        // Cleanup on unmount
        return () => {
            socketIo.disconnect();
        };
    }, [options]);

    // Function to send messages to the server
    const sendMessage = (event: string, message: any) => {
        if (!socket) return;

        socket.emit(event, message);
    };

    return { socket, sendMessage };
};
