import { ForwardedRef } from "react";

import Iconify, { IconifyComponentProps } from "@/components/iconify";

export const icon = (
    name: string,
    props?: Omit<IconifyComponentProps, "icon" | "ref">,
    ref?: ForwardedRef<SVGElement>
) => (
    <Iconify {...props} ref={ref} icon={`solar:${name}-bold-duotone`} />
    // OR
    // <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
    // https://icon-sets.iconify.design/solar/
    // https://www.streamlinehq.com/icons
);
