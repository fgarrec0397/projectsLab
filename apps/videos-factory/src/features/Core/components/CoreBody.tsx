"use client";

import { Paper, PaperProps } from "@projectslab/ui";
import { FC, PropsWithChildren } from "react";

type CoreBodyStyles = {
    body?: PaperProps;
};

const styles: CoreBodyStyles = {
    body: {
        sx: (theme) => ({
            overflow: "hidden",
            backgroundColor: theme.palette.background.default,
            cursor: "none",
        }),
    },
};

const CoreBody: FC<PropsWithChildren> = ({ children }) => {
    return (
        <Paper component="body" {...styles.body}>
            {children}
        </Paper>
    );
};

export default CoreBody;
