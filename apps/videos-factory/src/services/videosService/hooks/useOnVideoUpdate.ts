import { useEffect, useState } from "react";

import { useAuthContext } from "@/auth/hooks";
import { useSocket } from "@/services/socket/SocketContext";
import { IVideo } from "@/types/video";

export const useOnVideoUpdate = (callback?: (value: IVideo) => void) => {
    const socket = useSocket();
    const auth = useAuthContext();
    const [video, setVideo] = useState<IVideo>();

    useEffect(() => {
        function onVideoUpdate(value: IVideo) {
            setVideo(value);
            callback?.(value);
        }

        socket.on("videoUpdate", onVideoUpdate);

        return () => {
            socket.off("videoUpdate", onVideoUpdate);
        };
    }, [auth.user?.id, callback, socket]);

    return video;
};
