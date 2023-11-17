"use client";

import CheckboxLib, { CheckboxProps as LibCheckboxProps } from "@mui/material/Checkbox";
import { FC } from "react";

export type CheckboxProps = LibCheckboxProps;

const Checkbox: FC<CheckboxProps> = (props) => {
    return <CheckboxLib {...props} />;
};

export default Checkbox;
