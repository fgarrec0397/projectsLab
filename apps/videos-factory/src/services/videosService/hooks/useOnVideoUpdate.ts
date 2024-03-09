import { useEffect, useState } from "react";

import { useSocket } from "@/services/socket/SocketContext";
import { IVideo } from "@/types/video";

export const useOnVideoUpdate = (callback?: () => void) => {
    const socket = useSocket();
    const [video, setVideo] = useState<IVideo>();

    useEffect(() => {
        function onVideoUpdate(value: any) {
            setVideo(value);
        }

        socket.on("videoUpdate", onVideoUpdate);
        callback?.();

        return () => {
            socket.off("videoUpdate", onVideoUpdate);
        };
    }, [callback, socket]);

    return video;
};
