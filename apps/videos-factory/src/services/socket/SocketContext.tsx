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

const SocketContext = createContext<Socket | null>(null);

export const SocketProvider: FC<PropsWithChildren> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const newSocket = io(process.env.NEXT_PUBLIC_CREATEIFY_SERVICE_WEBSOCKET_URL || "");
        setSocket(newSocket);

        return () => {
            newSocket.close();
        };
    }, []);

    return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (context === null) {
        throw new Error("useSocket must be used within a SocketProvider");
    }
    return context;
};
