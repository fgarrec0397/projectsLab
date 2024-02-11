import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export const useFolderNavigation = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentPath = searchParams.get("path");

    const goTo = useCallback(
        (path: string) => {
            const folderPath = path.endsWith("/") ? path.slice(0, -1) : path;
            const query = `?path=${folderPath}`;

            router.push(`${pathname}${query}`);
        },
        [pathname, router]
    );

    return {
        currentPath,
        goTo,
    };
};
