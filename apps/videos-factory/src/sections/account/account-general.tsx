import { yupResolver } from "@hookform/resolvers/yup";
import LoadingButton from "@mui/lab/LoadingButton";
import { Alert } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

import { useAuthContext } from "@/auth/hooks";
import { TertiaryButton } from "@/components/button/tertiary-button";
import { ConfirmDialog } from "@/components/custom-dialog";
import FormProvider, { RHFTextField } from "@/components/hook-form";
import { useSnackbar } from "@/components/snackbar";
import { useBoolean } from "@/hooks/use-boolean";
import { deleteUser, updateUser } from "@/services/usersService/usersService";

// ----------------------------------------------------------------------

type UserType = {
    displayName: string;
    email: string;
    isPublic: boolean;
};

export default function AccountGeneral() {
    const { enqueueSnackbar } = useSnackbar();

    const { user } = useAuthContext();

    const router = useRouter();

    const confirmDelete = useBoolean();

    const UpdateUserSchema = Yup.object().shape({
        displayName: Yup.string().required("Name is required"),
        email: Yup.string()
            .required("Email is required")
            .email("Email must be a valid email address"),
        isPublic: Yup.boolean(),
    });

    const defaultValues: UserType = {
        displayName: user?.displayName || "",
        email: user?.email || "",
        isPublic: user?.isPublic || false,
    };

    const methods = useForm({
        resolver: yupResolver(UpdateUserSchema),
        defaultValues,
    });

    const {
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const onCancel = () => {
        router.back();
    };

    const onDelete = useCallback(async () => {
        try {
            await deleteUser(user?.accessToken, user?.id);
            window.location.reload();
        } catch (error) {
            enqueueSnackbar("Something went wrong", { variant: "error" });
        }
    }, [enqueueSnackbar, user]);

    const onSubmit = handleSubmit(async (data) => {
        try {
            await updateUser(user?.accessToken, user?.id, data);
            enqueueSnackbar("Profile updated with success!");
        } catch (error) {
            console.error(error);
        }
    });

    return (
        <FormProvider methods={methods} onSubmit={onSubmit}>
            <Card sx={{ p: 3 }}>
                <Alert severity="warning" sx={{ mb: 3 }}>
                    You <strong>cannot</strong> change your <strong>email address</strong> nor your{" "}
                    <strong>password</strong> for the moment. <br />
                    To <strong>change your password</strong>, please pass by the{" "}
                    <strong>forgot password</strong>
                </Alert>
                <Box
                    rowGap={3}
                    columnGap={2}
                    display="grid"
                    gridTemplateColumns={{
                        xs: "repeat(1, 1fr)",
                        sm: "repeat(2, 1fr)",
                    }}
                >
                    <RHFTextField name="displayName" label="Name" />
                    <RHFTextField name="email" label="Email Address" disabled />
                </Box>

                <Stack
                    spacing={3}
                    sx={{ mt: 3 }}
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                >
                    <Stack spacing={3} direction="row" alignItems="center">
                        <LoadingButton
                            type="submit"
                            variant="contained"
                            color="primary"
                            loading={isSubmitting}
                        >
                            Save Changes
                        </LoadingButton>
                        <TertiaryButton onClick={onCancel}>Cancel</TertiaryButton>
                    </Stack>
                    <Button variant="soft" color="error" onClick={confirmDelete.onTrue}>
                        Delete Account
                    </Button>
                </Stack>
            </Card>

            <ConfirmDialog
                open={confirmDelete.value}
                onClose={confirmDelete.onFalse}
                title="Delete"
                content={
                    <>
                        <Alert severity="error">
                            You are about to <strong>DELETE YOUR ACCOUNT</strong> and{" "}
                            <strong>LOSE</strong> all the data you have stored
                            <br />
                            <br />
                            Your plan will be <strong>CANCELED</strong> and{" "}
                            <strong>WILL NOT BE REFUNDED NOR PRORATED</strong> in case you decide to
                            come back
                            <br />
                            <br />
                            <strong>Are you sure?</strong>
                        </Alert>
                    </>
                }
                action={
                    <Button variant="contained" color="error" onClick={onDelete}>
                        Yes, delete my account
                    </Button>
                }
            />
        </FormProvider>
    );
}
