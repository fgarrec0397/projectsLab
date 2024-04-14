import { yupResolver } from "@hookform/resolvers/yup";
import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

import { useAuthContext } from "@/auth/hooks";
import { TertiaryButton } from "@/components/button/tertiary-button";
import FormProvider, { RHFTextField } from "@/components/hook-form";
import { useSnackbar } from "@/components/snackbar";
import { useMockedUser } from "@/hooks/use-mocked-user";
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

    const onDelete = async () => {
        try {
            await deleteUser(user?.accessToken, user?.id);
            window.location.reload();
        } catch (error) {}
    };

    const onSubmit = handleSubmit(async (data) => {
        try {
            await updateUser(user?.accessToken, user?.id, data);
            enqueueSnackbar("Profile updated with success!");
            console.info("DATA", data);
        } catch (error) {
            console.error(error);
        }
    });

    return (
        <FormProvider methods={methods} onSubmit={onSubmit}>
            <Card sx={{ p: 3 }}>
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
                    <RHFTextField name="email" label="Email Address" />
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
                    <Button variant="soft" color="error" onClick={onDelete}>
                        Delete Account
                    </Button>
                </Stack>
            </Card>
        </FormProvider>
    );
}
