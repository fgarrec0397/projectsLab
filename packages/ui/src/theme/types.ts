import { SxProps as MuiSxProps, Theme } from "@mui/material";
import { FlattenInterpolation } from "@mui/styled-engine-sc";

export type ThemedFlattenInterpolation = FlattenInterpolation<Theme>;

export type SxProps<T extends Theme = Theme> = MuiSxProps<T>;
