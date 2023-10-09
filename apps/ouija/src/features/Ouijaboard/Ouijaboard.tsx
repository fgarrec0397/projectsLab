"use client";

import { Box, BoxProps } from "@projectslab/ui";
import Image from "next/image";
import { FC } from "react";

import useOuijaboard from "./_actions/hooks/useOuijaboard";
import InteractiveOverlay from "./components/InteractiveOverlay";
import { BoardPointer } from "./ouijaBoardTypes";

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
] as BoardPointer[];

const Ouijaboard: FC = () => {
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
