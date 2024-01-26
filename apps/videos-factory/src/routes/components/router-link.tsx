import Link, { LinkProps } from "next/link";
import { forwardRef } from "react";

// ----------------------------------------------------------------------

const RouterLink = forwardRef<HTMLAnchorElement, LinkProps>(({ ...other }, ref) => (
    <Link ref={ref} {...other} />
));

RouterLink.displayName = "RouterLink";

export default RouterLink;
