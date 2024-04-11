import Link, { LinkProps } from "next/link";
import { forwardRef } from "react";

// ----------------------------------------------------------------------

type Props = LinkProps & {
    target?: string;
};

const RouterLink = forwardRef<HTMLAnchorElement, Props>(({ ...other }, ref) => (
    <Link ref={ref} {...other} />
));

RouterLink.displayName = "RouterLink";

export default RouterLink;
