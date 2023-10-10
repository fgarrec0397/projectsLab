"use client";

import { Box, BoxProps } from "@projectslab/ui";
import Image from "next/image";
import { FC } from "react";

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
