"use client";

import { FC, PropsWithChildren } from "react";

import CoreBody from "./components/CoreBody";

const Core: FC<PropsWithChildren> = ({ children }) => {
    return <CoreBody>{children}</CoreBody>;
};

export default Core;
