import { usePathname } from "next/navigation";

// ----------------------------------------------------------------------

type ReturnType = boolean;

export function useActiveLink(currentPath: string, deep = true): ReturnType {
    const pathname = usePathname();

    const checkPath = currentPath.startsWith("#");

    const normalActive = !checkPath && pathname === currentPath;

    const deepActive = !checkPath && pathname.includes(currentPath);

    return deep ? deepActive : normalActive;
}
