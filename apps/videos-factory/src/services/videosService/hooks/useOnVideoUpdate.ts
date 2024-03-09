import { useEffect, useState } from "react";

import { useSocket } from "@/services/socket/SocketContext";
import { IVideo } from "@/types/video";

export const useOnVideoUpdate = (callback?: (value: IVideo) => void) => {
    const socket = useSocket();
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
    }, [callback, socket]);

    return video;
};
