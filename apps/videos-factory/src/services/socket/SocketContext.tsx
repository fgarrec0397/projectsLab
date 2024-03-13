"use client";

import React, {
    createContext,
    FC,
    PropsWithChildren,
    useContext,
    useEffect,
    useState,
} from "react";
import io, { Socket } from "socket.io-client";

import { useAuthContext } from "@/auth/hooks";

const SocketContext = createContext<Socket | null>(null);

export const SocketProvider: FC<PropsWithChildren> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const auth = useAuthContext();

    useEffect(() => {
        if (auth.user?.id) {
            const newSocket = io(process.env.NEXT_PUBLIC_CREATEIFY_SERVICE_WEBSOCKET_URL || "");

            newSocket.emit("connectUser", { userId: auth.user.id });

            setSocket(newSocket);

            return () => {
                newSocket.emit("disconnectUser", { userId: auth.user?.id });
                newSocket.close();
            };
        }
    }, [auth.user?.id]);

    return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (context === null) {
        throw new Error("useSocket must be used within a SocketProvider");
    }
    return context;
};
