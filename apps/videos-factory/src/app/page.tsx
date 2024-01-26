"use client";

import { useEffect } from "react";

import { PATH_AFTER_LOGIN } from "@/config-global";
import { useRouter } from "@/routes/hooks";

// ----------------------------------------------------------------------

export default function HomePage() {
    const router = useRouter();

    useEffect(() => {
        router.push(PATH_AFTER_LOGIN);
    }, [router]);

    return null;
}
