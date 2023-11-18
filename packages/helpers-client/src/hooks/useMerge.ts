import { merge } from "@projectslab/helpers";
import { useMemo } from "react";

export default <TObject1, TObject2>(object1: TObject1, object2: TObject2) => {
    return useMemo(() => {
        return merge(object1, object2);
    }, [object1, object2]);
};
