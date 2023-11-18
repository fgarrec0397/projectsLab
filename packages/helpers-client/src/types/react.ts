import { ReactNode } from "react";

/**
 * A React component with callable children prop
 */
export type HasCallableChildren<P> = {
    children: (param: P) => ReactNode | ReactNode[];
};
