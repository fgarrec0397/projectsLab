import { useEffect, useState } from "react";

import { useSocket } from "@/services/socket/SocketContext";
import SocketManager from "@/services/socket/SocketManager";
// import { socket } from "@/services/socket/socket";
import { IVideo } from "@/types/video";

export const useGetVideosStatus = () => {
    const socket = useSocket();
    const [video, setVideo] = useState<IVideo>();

    useEffect(() => {
        console.log(video?.status, "video status");
    }, [video?.status]);

    // useEffect(() => {
    //     // no-op if the socket is already connected
    //     socket.connect();

    //     return () => {
    //         socket.disconnect();
    //     };
    // }, []);

    useEffect(() => {
        // console.log("Component mounted");
        function videoProcessingSteps(value: any) {
            setVideo(value);
        }
        socket.on("videoProcessingSteps", videoProcessingSteps);

        return () => {
            socket.off("videoProcessingSteps", videoProcessingSteps);
        };
    }, [socket]);
};
