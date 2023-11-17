"use client";

import InputAdornmentLib, {
    InputAdornmentProps as LibInputAdornmentProps,
} from "@mui/material/InputAdornment";
import InputLabelLib, { InputLabelProps as LibInputLabelProps } from "@mui/material/InputLabel";
import TextFieldLib, { TextFieldProps as LibTextFieldProps } from "@mui/material/TextField";
import { FC } from "react";

export type TextFieldProps = LibTextFieldProps & {
    labelPosition?: "top" | "left";
};
export type InputLabelProps = LibInputLabelProps;
export type InputAdornmentProps = LibInputAdornmentProps;

const TextField: FC<TextFieldProps> = ({ children, ...props }) => {
    return <TextFieldLib {...props}>{children}</TextFieldLib>;
};

TextField.displayName = "TextField";

export const InputLabel: FC<InputLabelProps> = ({ children, ...props }) => {
    return <InputLabelLib {...props}>{children}</InputLabelLib>;
};

export const InputAdornment: FC<InputAdornmentProps> = ({ children, ...props }) => {
    return <InputAdornmentLib {...props}>{children}</InputAdornmentLib>;
};

export default TextField;
