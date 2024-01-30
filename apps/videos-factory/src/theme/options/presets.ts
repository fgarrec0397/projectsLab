import { alpha } from "@mui/material/styles";

import { grey, primary } from "../palette";

// ----------------------------------------------------------------------

type PresetType = "default" | "green" | "purple" | "blue" | "orange" | "red";

export function createPresets(preset: PresetType) {
    const primaryColor = getPrimary(preset);

    const theme = {
        palette: {
            primary: primaryColor,
        },
        customShadows: {
            primary: `0 8px 16px 0 ${alpha(`${primaryColor?.main}`, 0.24)}`,
        },
    };

    return {
        ...theme,
    };
}

// ----------------------------------------------------------------------

const green = {
    lighter: "#C8FAD6",
    light: "#5BE49B",
    main: "#00A76F",
    dark: "#007867",
    darker: "#004B50",
    contrastText: "#FFFFFF",
};

const purple = {
    lighter: "#EBD6FD",
    light: "#B985F4",
    main: "#7635dc",
    dark: "#431A9E",
    darker: "#200A69",
    contrastText: "#FFFFFF",
};

const blue = {
    lighter: "#D1E9FC",
    light: "#76B0F1",
    main: "#2065D1",
    dark: "#103996",
    darker: "#061B64",
    contrastText: "#FFFFFF",
};

const orange = {
    lighter: "#FEF4D4",
    light: "#FED680",
    main: "#fda92d",
    dark: "#B66816",
    darker: "#793908",
    contrastText: grey[800],
};

const red = {
    lighter: "#FFE3D5",
    light: "#FFC1AC",
    main: "#FF3030",
    dark: "#B71833",
    darker: "#7A0930",
    contrastText: "#FFFFFF",
};

export const presetOptions = [
    { name: "default", value: primary.main },
    { name: "green", value: green.main },
    { name: "purple", value: purple.main },
    { name: "blue", value: blue.main },
    { name: "orange", value: orange.main },
    { name: "red", value: red.main },
];

export function getPrimary(preset: PresetType) {
    return {
        default: primary,
        green,
        purple,
        blue,
        orange,
        red,
    }[preset];
}
