// Import necessary libraries
import { useCallback, useEffect, useState } from "react";

// This is the main component of our application
export default function Home() {
    // Define state variables for the result, recording status, and media recorder
    const [result, setResult] = useState<string | null>(null);
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

    // Function to start recording
    const startRecording = useCallback(() => {
        if (mediaRecorder) {
            mediaRecorder.start();
        }
    }, [mediaRecorder]);

    // Function to stop recording
    const stopRecording = useCallback(() => {
        if (mediaRecorder) {
            mediaRecorder.stop();
        }
    }, [mediaRecorder]);

    // This useEffect hook sets up the media recorder when the component mounts
    useEffect(() => {
        // This array will hold the audio data
        let chunks: Blob[] = [];

        if (typeof window !== "undefined") {
            navigator.mediaDevices
                .getUserMedia({ audio: true })
                .then((stream) => {
                    const newMediaRecorder = new MediaRecorder(stream);
                    newMediaRecorder.onstart = () => {
                        chunks = [];
                    };
                    newMediaRecorder.ondataavailable = (e) => {
                        chunks.push(e.data);
                    };
                    newMediaRecorder.onstop = async () => {
                        const audioBlob = new Blob(chunks, { type: "audio/webm" });
                        const audioUrl = URL.createObjectURL(audioBlob);
                        const audio = new Audio(audioUrl);
                        audio.onerror = function (err) {
                            console.error("Error playing audio:", err);
                        };

                        audio.play();

                        try {
                            const reader = new FileReader();
                            reader.readAsDataURL(audioBlob);
                            reader.onloadend = async function () {
                                const base64Audio = reader.result?.toString().split(",")[1]; // Remove the data URL prefix
                                if (base64Audio) {
                                    const response = await fetch("/api/testChatGpt", {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json",
                                        },
                                        body: JSON.stringify({ audio: base64Audio }),
                                    });
                                    const data = await response.json();
                                    if (response.status !== 200) {
                                        throw (
                                            data.error ||
                                            new Error(
                                                `Request failed with status ${response.status}`
                                            )
                                        );
                                    }
                                    setResult(data.result);
                                }
                            };
                        } catch (error) {
                            console.error(error);
                            alert((error as any).message);
                        }
                    };
                    setMediaRecorder(newMediaRecorder);
                })
                .catch((err) => console.error("Error accessing microphone:", err));
        }
    }, []);

    useEffect(() => {
        const keyboardRecordButtonIsDownHandler = (event: KeyboardEvent) => {
            if (event.code === "Space" && !isRecording) {
                setIsRecording(true);
            }
        };
        const keyboardRecordButtonIsUpHandler = (event: KeyboardEvent) => {
            if (event.code === "Space" && isRecording) {
                setIsRecording(false);
            }
        };

        window.addEventListener("keydown", keyboardRecordButtonIsDownHandler);
        window.addEventListener("keyup", keyboardRecordButtonIsUpHandler);
    }, [isRecording, startRecording, stopRecording]);

    useEffect(() => {
        if (isRecording) {
            return startRecording();
        }

        if (!isRecording) {
            stopRecording();
        }
    }, [isRecording, startRecording, stopRecording]);

    useEffect(() => {
        console.log(result, "result");
    }, [result]);

    return null;
}
