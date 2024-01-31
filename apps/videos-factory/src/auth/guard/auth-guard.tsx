import { useCallback, useEffect, useState } from "react";

import { SplashScreen } from "@/components/loading-screen";
import { useRouter } from "@/routes/hooks";
import { paths } from "@/routes/paths";

import { useAuthContext } from "../hooks";

// ----------------------------------------------------------------------

const loginPaths: Record<string, string> = {
    firebase: paths.auth.login,
};

// ----------------------------------------------------------------------

type Props = {
    children: React.ReactNode;
};

export default function AuthGuard({ children }: Props) {
    const { loading } = useAuthContext();

    return <>{loading ? <SplashScreen /> : <Container>{children}</Container>}</>;
}

// ----------------------------------------------------------------------

function Container({ children }: Props) {
    const router = useRouter();

    const { authenticated, method } = useAuthContext();

    const [checked, setChecked] = useState(false);

    const check = useCallback(() => {
        if (!authenticated) {
            const searchParams = new URLSearchParams({
                returnTo: window.location.pathname,
            }).toString();

            const loginPath = loginPaths[method];

            const href = `${loginPath}?${searchParams}`;

            router.replace(href);
        } else {
            setChecked(true);
        }
    }, [authenticated, method, router]);

    useEffect(() => {
        check();
    }, [check]);

    if (!checked) {
        return null;
    }

    return <>{children}</>;
}
