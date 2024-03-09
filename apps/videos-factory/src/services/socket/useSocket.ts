// import { useEffect, useState } from "react";

// import { socket } from "./socket";

// interface UseSocketOptions {
//     event: string;
//     onConnect?: () => void;
//     onDisconnect?: (reason: string) => void;
//     onMessage?: <TMessage>(message: TMessage) => void;
// }

// export const useSocket = (options: UseSocketOptions) => {
//     const [isConnected, setIsConnected] = useState(socket.connected);
//     const [fooEvents, setFooEvents] = useState<any[]>([]);

//     useEffect(() => {
//         console.log(isConnected, "isConnected");
//     }, [isConnected]);

//     useEffect(() => {
//         console.log(fooEvents, "fooEvents");
//     }, [fooEvents]);

//     useEffect(() => {
//         function onConnect() {
//             setIsConnected(true);
//         }

//         function onDisconnect() {
//             setIsConnected(false);
//         }

//         function videoProcessingSteps(value: any) {
//             setFooEvents((previous) => [...previous, value]);
//         }

//         if (!isConnected) {
//             socket.on("connect", onConnect);
//         }

//         if (isConnected) {
//             socket.on("disconnect", onDisconnect);
//             socket.on("videoProcessingSteps", videoProcessingSteps);
//         }

//         return () => {
//             if (isConnected) {
//                 socket.off("connect", onConnect);
//                 socket.off("disconnect", onDisconnect);
//                 socket.off("videoProcessingSteps", videoProcessingSteps);
//             }
//         };
//     }, [isConnected]);
// };
