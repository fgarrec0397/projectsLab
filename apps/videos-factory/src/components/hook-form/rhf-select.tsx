import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import FormControl, { FormControlProps } from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectProps } from "@mui/material/Select";
import { SxProps, Theme } from "@mui/material/styles";
import { Controller, useFormContext } from "react-hook-form";

// ----------------------------------------------------------------------

type RHFSelectProps = Omit<SelectProps, "variant"> & {
    name: string;
    label?: string;
    native?: boolean;
    helperText?: string;
    maxHeight?: boolean | number;
    children: React.ReactNode;
    PaperPropsSx?: SxProps<Theme>;
};

export function RHFSelect({
    name,
    label,
    native,
    helperText,
    maxHeight = 220,
    children,
    PaperPropsSx,
    ...other
}: RHFSelectProps) {
    const { control } = useFormContext();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <>
                    <Select
                        {...field}
                        fullWidth
                        native={native}
                        MenuProps={{
                            PaperProps: {
                                sx: {
                                    ...(!native && {
                                        maxHeight:
                                            typeof maxHeight === "number" ? maxHeight : "unset",
                                    }),
                                    ...PaperPropsSx,
                                },
                            },
                        }}
                        sx={{ textTransform: "capitalize" }}
                        error={!!error}
                        {...other}
                    >
                        {children}
                    </Select>
                    {!!error && (
                        <FormHelperText error sx={{ px: 2, textAlign: "center" }}>
                            {error.message}
                        </FormHelperText>
                    )}
                </>
            )}
        />
    );
}

// ----------------------------------------------------------------------

type RHFMultiSelectProps = FormControlProps & {
    name: string;
    label?: string;
    chip?: boolean;
    checkbox?: boolean;
    placeholder?: string;
    helperText?: React.ReactNode;
    options: {
        label: string;
        value: string;
    }[];
};

export function RHFMultiSelect({
    name,
    chip,
    label,
    options,
    checkbox,
    placeholder,
    helperText,
    ...other
}: RHFMultiSelectProps) {
    const { control } = useFormContext();

    const renderValues = (selectedIds: string[]) => {
        const selectedItems = options.filter((item) => selectedIds.includes(item.value));

        if (!selectedItems.length && placeholder) {
            return <Box sx={{ color: "text.disabled" }}>{placeholder}</Box>;
        }

        if (chip) {
            return (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selectedItems.map((item) => (
                        <Chip key={item.value} size="small" label={item.label} />
                    ))}
                </Box>
            );
        }

        return selectedItems.map((item) => item.label).join(", ");
    };

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <FormControl error={!!error} {...other}>
                    {label && <InputLabel id={name}> {label} </InputLabel>}

                    <Select
                        {...field}
                        multiple
                        displayEmpty={!!placeholder}
                        id={`multiple-${name}`}
                        labelId={name}
                        label={label}
                        renderValue={renderValues}
                    >
                        {options.map((option) => {
                            const selected = field.value.includes(option.value);

                            return (
                                <MenuItem key={option.value} value={option.value}>
                                    {checkbox && (
                                        <Checkbox size="small" disableRipple checked={selected} />
                                    )}

                                    {option.label}
                                </MenuItem>
                            );
                        })}
                    </Select>

                    {(!!error || helperText) && (
                        <FormHelperText error={!!error}>
                            {error ? error?.message : helperText}
                        </FormHelperText>
                    )}
                </FormControl>
            )}
        />
    );
}
