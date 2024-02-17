import FormHelperText from "@mui/material/FormHelperText";
import Slider, { SliderProps } from "@mui/material/Slider";
import { Controller, useFormContext } from "react-hook-form";

// ----------------------------------------------------------------------

type Props = SliderProps & {
    name: string;
    helperText?: React.ReactNode;
};

export default function RHFSlider({ name, helperText, ...other }: Props) {
    const { control } = useFormContext();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <>
                    {(!!error || helperText) && (
                        <FormHelperText error={!!error}>
                            {error ? error?.message : helperText}
                        </FormHelperText>
                    )}
                    <Slider {...field} valueLabelDisplay="auto" {...other} />
                </>
            )}
        />
    );
}
