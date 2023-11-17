"use client";

import { Paper, PaperProps } from "@projectslab/ui";
import { FC, PropsWithChildren } from "react";

type CoreBodyStyles = {
    body?: PaperProps;
};

const styles: CoreBodyStyles = {};

const CoreBody: FC<PropsWithChildren> = ({ children }) => {
    return (
        <Paper component="body" {...styles.body}>
            {children}
        </Paper>
    );
};

export default CoreBody;
