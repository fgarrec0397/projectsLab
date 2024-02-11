import { useCallback, useEffect, useMemo, useState } from "react";

import { BreadcrumbsLinkProps } from "@/components/custom-breadcrumbs";

import { useFolderNavigation } from "./use-folder-navigation";

export const useFolderBreadcrumbs = () => {
    const rootLink: BreadcrumbsLinkProps = useMemo(
        () => ({
            name: "My Files",
        }),
        []
    );

    const { currentPath } = useFolderNavigation();
    const [breadcrumbsLinks, setLinks] = useState<BreadcrumbsLinkProps[]>([rootLink]);

    const buildLinks = useCallback(() => {
        const pathArray = currentPath?.split("/");
        const links: BreadcrumbsLinkProps[] = [rootLink];
        console.log(pathArray, "pathArray");

        const test = pathArray?.reduce((prev, current, currentIndex) => {
            console.log("reduce");

            console.log({ prev, current });

            links.push({
                name: current,
                href: currentIndex === pathArray.length - 1 ? `${prev}/${current}` : undefined,
            });

            return current;
        });

        console.log(test, "test");
        console.log(links, "links");
    }, [currentPath, rootLink]);

    useEffect(() => {
        buildLinks();
    }, [buildLinks, currentPath]);

    return breadcrumbsLinks;
};
