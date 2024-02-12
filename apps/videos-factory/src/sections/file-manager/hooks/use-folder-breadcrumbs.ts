import { useCallback, useEffect, useMemo, useState } from "react";

import { BreadcrumbsLinkProps } from "@/components/custom-breadcrumbs";
import { paths } from "@/routes/paths";

import { useFolderNavigation } from "./use-folder-navigation";

export const useFolderBreadcrumbs = () => {
    const { currentPath } = useFolderNavigation();
    const rootLink: BreadcrumbsLinkProps = useMemo(
        () => ({
            name: "My Files",
            href: currentPath ? paths.dashboard.fileManager : undefined,
        }),
        [currentPath]
    );

    const [breadcrumbsLinks, setLinks] = useState<BreadcrumbsLinkProps[]>([rootLink]);

    const buildLinks = useCallback(() => {
        const pathArray = currentPath?.split("/");
        const links: BreadcrumbsLinkProps[] = [rootLink];

        pathArray?.reduce((prev, current, currentIndex) => {
            const filesPath = prev !== "" ? `${prev}/${current}` : current;

            links.push({
                name: current,
                href:
                    currentIndex === pathArray.length - 1
                        ? undefined
                        : `${paths.dashboard.fileManager}?path=${filesPath}`,
            });

            return filesPath;
        }, "");

        setLinks(links);
    }, [currentPath, rootLink]);

    useEffect(() => {
        buildLinks();
    }, [buildLinks, currentPath]);

    return breadcrumbsLinks;
};
