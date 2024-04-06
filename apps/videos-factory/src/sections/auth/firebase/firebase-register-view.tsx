"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import LoadingButton from "@mui/lab/LoadingButton";
import { Card, CardContent } from "@mui/material";
import Alert from "@mui/material/Alert";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

import { useAuthContext } from "@/auth/hooks";
import FormProvider, { RHFTextField } from "@/components/hook-form";
import Iconify from "@/components/iconify";
import { useBoolean } from "@/hooks/use-boolean";
import { RouterLink } from "@/routes/components";
import { useRouter } from "@/routes/hooks";
import { paths } from "@/routes/paths";
import { pxToRem } from "@/theme/typography";

import LoginWithGoogleButton from "./components/login-with-google-button";

// ----------------------------------------------------------------------

export default function FirebaseRegisterView() {
    const { register, loginWithGoogle } = useAuthContext();

    const [errorMsg, setErrorMsg] = useState("");

    const router = useRouter();

    const password = useBoolean();

    const RegisterSchema = Yup.object().shape({
        email: Yup.string()
            .required("Email is required")
            .email("Email must be a valid email address"),
        password: Yup.string().required("Password is required"),
    });

    const defaultValues = {
        email: "",
        password: "",
    };

    const methods = useForm({
        resolver: yupResolver(RegisterSchema),
        defaultValues,
    });

    const {
        reset,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const onSubmit = handleSubmit(async (data) => {
        try {
            await register?.(data.email, data.password);
            const searchParams = new URLSearchParams({
                email: data.email,
            }).toString();

            const href = `${paths.auth.verify}?${searchParams}`;

            router.push(href);
        } catch (error) {
            console.error(error);
            reset();
            setErrorMsg(typeof error === "string" ? error : (error as any).message);
        }
    });

    const handleGoogleLogin = async () => {
        try {
            await loginWithGoogle?.();
        } catch (error) {
            console.error(error);
        }
    };

    const renderHead = (
        <Stack spacing={2} sx={{ mb: 5, position: "relative" }}>
            <Typography variant="h4">Sign up to Createify</Typography>

            <Stack direction="row" spacing={0.5}>
                <Typography variant="body2"> Already have an account? </Typography>

                <Link href={paths.auth.login} component={RouterLink} variant="subtitle2">
                    Sign in
                </Link>
            </Stack>
        </Stack>
    );

    const renderTerms = (
        <Typography
            component="div"
            sx={{
                mt: 2.5,
                textAlign: "center",
                typography: "caption",
                color: "text.secondary",
            }}
        >
            {"By signing up, I agree to "}
            <Link href={paths.termsAndConditions} underline="always" color="text.primary">
                Terms of Service
            </Link>
            {" and "}
            <Link href={paths.privacyPolicy} underline="always" color="text.primary">
                Privacy Policy
            </Link>
            .
        </Typography>
    );

    const renderForm = (
        <Stack spacing={2.5}>
            <RHFTextField name="email" label="Email address" />

            <RHFTextField
                name="password"
                label="Password"
                type={password.value ? "text" : "password"}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={password.onToggle} edge="end">
                                <Iconify
                                    icon={
                                        password.value ? "solar:eye-bold" : "solar:eye-closed-bold"
                                    }
                                />
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />

            <LoadingButton
                fullWidth
                color="primary"
                size="large"
                type="submit"
                variant="contained"
                loading={isSubmitting}
            >
                Create account
            </LoadingButton>
        </Stack>
    );

    const renderLoginOption = (
        <div>
            <Divider
                sx={{
                    my: 2.5,
                    typography: "overline",
                    color: "text.disabled",
                    "&:before, :after": {
                        borderTopStyle: "dashed",
                    },
                }}
            >
                OR
            </Divider>

            <Stack direction="row" justifyContent="center" spacing={2}>
                <LoginWithGoogleButton onClick={handleGoogleLogin} />
            </Stack>
        </div>
    );

    return (
        <Card>
            <CardContent
                sx={{
                    p: pxToRem(36),
                    "&:last-child": {
                        pb: pxToRem(36),
                    },
                }}
            >
                {renderHead}
                {!!errorMsg && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {errorMsg}
                    </Alert>
                )}

                <FormProvider methods={methods} onSubmit={onSubmit}>
                    {renderForm}
                </FormProvider>

                {renderTerms}

                {renderLoginOption}
            </CardContent>
        </Card>
    );
}
