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
import { PATH_AFTER_LOGIN } from "@/config-global";
import { useBoolean } from "@/hooks/use-boolean";
import { RouterLink } from "@/routes/components";
import { useRouter, useSearchParams } from "@/routes/hooks";
import { paths } from "@/routes/paths";
import { pxToRem } from "@/theme/typography";

import LoginWithGoogleButton from "./components/login-with-google-button";

// ----------------------------------------------------------------------

export default function FirebaseLoginView() {
    const { login, loginWithGoogle } = useAuthContext();

    const router = useRouter();

    const [errorMsg, setErrorMsg] = useState("");

    const searchParams = useSearchParams();

    const returnTo = searchParams.get("returnTo");

    const password = useBoolean();

    const LoginSchema = Yup.object().shape({
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
        resolver: yupResolver(LoginSchema),
        defaultValues,
    });

    const {
        reset,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const onSubmit = handleSubmit(async (data) => {
        try {
            await login?.(data.email, data.password);

            router.push(returnTo || PATH_AFTER_LOGIN);
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
        <Stack spacing={2} sx={{ mb: 5 }}>
            <Typography variant="h4">Sign in to Createify</Typography>

            <Stack direction="row" spacing={0.5}>
                <Typography variant="body2">New user?</Typography>

                <Link component={RouterLink} href={paths.auth.register} variant="subtitle2">
                    Create an account
                </Link>
            </Stack>
        </Stack>
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

            <Link
                component={RouterLink}
                href={paths.auth.forgotPassword}
                variant="body2"
                color="inherit"
                underline="always"
                sx={{ alignSelf: "flex-end" }}
            >
                Forgot password?
            </Link>

            <LoadingButton
                fullWidth
                color="primary"
                size="large"
                type="submit"
                variant="contained"
                loading={isSubmitting}
            >
                Login
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

                {renderLoginOption}
            </CardContent>
        </Card>
    );
}
