import SkeletonLib, { SkeletonProps as LibSkeletonProps } from "@mui/material/Skeleton";
import { FC, forwardRef } from "react";

export type SkeletonProps = LibSkeletonProps;

const Skeleton: FC<SkeletonProps> = forwardRef<any, SkeletonProps>((props, ref) => {
    return <SkeletonLib ref={ref} {...props} />;
});

Skeleton.displayName = "Skeleton";

export default Skeleton;
