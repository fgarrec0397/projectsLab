import { useEffect, useState } from "react";

import { useAuthContext } from "@/auth/hooks";
import { useSocket } from "@/services/socket/SocketContext";
import { IUser } from "@/types/user";

export const useOnUserUpdate = (callback?: (value: IUser) => void) => {
    const socket = useSocket();
    const auth = useAuthContext();
    const [user, setUser] = useState<IUser>();

    useEffect(() => {
        function onUserUpdate(value: IUser) {
            setUser(value);
            callback?.(value);
        }

        socket.on("usageUpdate", onUserUpdate);

        return () => {
            socket.off("usageUpdate", onUserUpdate);
        };
    }, [auth.user?.id, callback, socket]);

    return user;
};
