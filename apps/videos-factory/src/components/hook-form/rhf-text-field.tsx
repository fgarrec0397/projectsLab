import TextField, { TextFieldProps } from "@mui/material/TextField";
import { Controller, useFormContext } from "react-hook-form";

// ----------------------------------------------------------------------

type Props = TextFieldProps & {
    name: string;
};

export default function RHFTextField({ name, helperText, type, ...other }: Props) {
    const { control } = useFormContext();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <TextField
                    {...field}
                    type={type}
                    value={type === "number" && field.value === 0 ? "" : field.value}
                    onChange={(event) => {
                        if (type === "number") {
                            field.onChange(Number(event.target.value));
                        } else {
                            field.onChange(event.target.value);
                        }
                    }}
                    error={!!error}
                    helperText={error ? error?.message : helperText}
                    {...other}
                />
            )}
        />
    );
}
