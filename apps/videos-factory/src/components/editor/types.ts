import { SxProps, Theme } from "@mui/material/styles";
import { ReactQuillProps } from "react-quill";

// ----------------------------------------------------------------------

export interface EditorProps extends ReactQuillProps {
    error?: boolean;
    simple?: boolean;
    helperText?: React.ReactNode;
    sx?: SxProps<Theme>;
}
