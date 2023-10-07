"use client";

import { Box, BoxProps } from "@projectslab/ui";
import Image from "next/image";
import { FC, useEffect } from "react";

import useHandleInitOuijaboard from "./_actions/hooks/useHandleInitOuijaboard";
import useOuijaboard from "./_actions/hooks/useOuijaboard";
import InteractiveOverlay from "./components/InteractiveOverlay";

type OuijaboardStyles = {
    imageWrapper?: BoxProps;
};

const styles: OuijaboardStyles = {
    imageWrapper: {
        sx: {
            position: "relative",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        },
    },
};

const lettersArray = [
    {
        id: "yes",
        value: "Yes",
        position: [114, 328],
    },
    {
        id: "no",
        value: "No",
        position: [103, 1059],
    },
    {
        id: "a",
        value: "A",
        position: [364, 129],
    },
    {
        id: "b",
        value: "B",
        position: [317, 229],
    },
    {
        id: "v",
        value: "V",
        position: [450, 1108],
    },
];

const Ouijaboard: FC = () => {
    const { messages } = useOuijaboard();

    const moveCursorTo = (idElement: string, cursor: HTMLElement) => {
        const currentElement = document.getElementById(idElement);
        const left = currentElement?.getBoundingClientRect().left;
        const top = currentElement?.getBoundingClientRect().top;

        if (!cursor || !left || !top) {
            return;
        }

        cursor.style.transition = "left 0.3s ease, top 0.3s ease";
        cursor.style.left = `${left}px`;
        cursor.style.top = `${top}px`;
    };

    const initCursorMovement = async (cursor: HTMLElement) => {
        const movementsPromises: Promise<void>[] = [];

        lettersArray.forEach(async (letter, index) => {
            movementsPromises.push(
                new Promise<void>((resolve) => {
                    setTimeout(() => {
                        moveCursorTo(letter.id, cursor);
                        resolve();
                    }, index * 3000);
                })
            );
        });

        await Promise.all(movementsPromises);
    };

    const onClickTest = async () => {
        const cursor = document.getElementById("cursor");

        if (!cursor) {
            return;
        }

        await initCursorMovement(cursor);

        cursor.style.transition = "transform 0.3s ease";
    };

    useHandleInitOuijaboard();

    return (
        <>
            <Box {...styles.imageWrapper}>
                <InteractiveOverlay />
                <Image src="/Ouijaboard.jpg" alt="ouija board" width={1344} height={896} />
            </Box>
        </>
    );
};

export default Ouijaboard;
