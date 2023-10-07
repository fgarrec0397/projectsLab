import { useEffect } from "react";

import useOuijaboard from "./useOuijaboard";

export default () => {
    const { initOuijaboard } = useOuijaboard();

    useEffect(() => {
        initOuijaboard();
    }, [initOuijaboard]);
};
