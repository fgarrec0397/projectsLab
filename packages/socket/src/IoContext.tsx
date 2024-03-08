import { createContext } from "react";

import { IoContextInterface } from "./types";

const IoContext = createContext<IoContextInterface<any>>({
    createConnection: () => undefined,
    getConnection: () => undefined,
    registerSharedListener: () => () => {},
});

export default IoContext;
