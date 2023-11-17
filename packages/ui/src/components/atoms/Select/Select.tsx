"use client";

import SelectLib, {
    SelectChangeEvent as SelectChangeEventLib,
    SelectProps as LibSelectProps,
} from "@mui/material/Select";
import { FC } from "react";

export type SelectProps = LibSelectProps;

const Select: FC<SelectProps> = ({ children, ...props }) => {
    return <SelectLib {...props}>{children}</SelectLib>;
};

export type SelectChangeEvent<T = unknown> = SelectChangeEventLib<T>;

export default Select;
