import { Fetcher } from "@projectslab/helpers";
import { useCallback } from "react";

import { BoardPointer, OuijaboardMessage } from "../../ouijaBoardTypes";
import boardData from "../_data/boardData";
import useOuijaboardService from "../_data/hooks/useOuijaboardService";

export default () => {
    const intervalBetweenMovement = 3000;
    const { messages, addMessage, isConnectionInit, updateConnection } = useOuijaboardService();
    const ouijaboardBaseURL = "/api/ouijaboard";

    const moveCursorTo = useCallback((idElement?: string, cursor?: HTMLElement) => {
        if (!idElement) {
            return;
        }

        const currentElement = document.getElementById(idElement);
        const left = currentElement?.getBoundingClientRect().left;
        const top = currentElement?.getBoundingClientRect().top;

        if (!cursor || !left || !top) {
            return;
        }

        cursor.style.transition = "left 0.3s ease, top 0.3s ease";
        cursor.style.left = `${left}px`;
        cursor.style.top = `${top}px`;
    }, []);

    const moveCursor = useCallback(
        async (cursor: HTMLElement, pointers: (BoardPointer | undefined)[]) => {
            const movementsPromises: Promise<void>[] = [];

            pointers.forEach(async (letter, index) => {
                movementsPromises.push(
                    new Promise<void>((resolve) => {
                        setTimeout(() => {
                            moveCursorTo(letter?.id, cursor);
                            resolve();
                        }, index * intervalBetweenMovement);
                    })
                );
            });

            await Promise.all(movementsPromises);
        },
        [moveCursorTo]
    );

    const initCursorMovement = useCallback(
        async (pointers: (BoardPointer | undefined)[]) => {
            const cursor = document.getElementById("cursor");

            if (!cursor) {
                return;
            }

            await moveCursor(cursor, pointers);

            setTimeout(() => {
                cursor.style.transition = "transform 0.3s ease";
            }, intervalBetweenMovement);
        },
        [moveCursor]
    );

    const sendQuestion = useCallback(
        async (question: string) => {
            if (!isConnectionInit) {
                const confirmConnectionResponse = await Fetcher.post<{ question: string }, boolean>(
                    "/api/confirmConnection",
                    {
                        question,
                    }
                );

                updateConnection(confirmConnectionResponse);

                if (!confirmConnectionResponse) {
                    // eslint-disable-next-line no-console
                    console.log("No action is possible since the connection is not possible");
                    return;
                }
            }

            const newMessage: OuijaboardMessage = { role: "user", content: question };
            const messagesWithQuestion: OuijaboardMessage[] = [...messages, newMessage];

            const response = await Fetcher.post<
                { messages: OuijaboardMessage[] },
                OuijaboardMessage
            >(ouijaboardBaseURL, {
                messages: messagesWithQuestion,
            });

            addMessage(newMessage);

            const responseContent = response.content;

            let pointers: (BoardPointer | undefined)[] = responseContent!
                .split("")
                .map((x) => x.toLowerCase())
                .map((x) => {
                    const boardDataElement = boardData.find((y) => y.id === x);
                    return boardDataElement;
                });

            if (responseContent?.toLowerCase().includes("yes")) {
                pointers = [boardData.find((y) => y.id === "yes")];
            }

            if (responseContent?.toLowerCase().includes("no")) {
                pointers = [boardData.find((y) => y.id === "no")];
            }

            if (responseContent?.toLowerCase().includes("good bye")) {
                pointers = [boardData.find((y) => y.id === "goodbye")];
            }

            initCursorMovement(pointers);
        },
        [isConnectionInit, messages, addMessage, initCursorMovement, updateConnection]
    );

    return {
        messages,
        moveCursorTo,
        moveCursor,
        sendQuestion,
        initCursorMovement,
    };
};
