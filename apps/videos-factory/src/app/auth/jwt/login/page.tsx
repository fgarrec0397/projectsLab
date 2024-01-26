import { JwtLoginView } from "@/sections/auth/jwt";

// ----------------------------------------------------------------------

export const metadata = {
    title: "Jwt: Login",
};

export default function LoginPage() {
    return <JwtLoginView />;
}
