"use client";

import { HasChildren } from "@projectslab/helpers";
import { FC } from "react";

import CoreBody from "./components/CoreBody";

type Props = HasChildren;

const Core: FC<Props> = ({ children }) => {
    return <CoreBody>{children}</CoreBody>;
};

export default Core;
