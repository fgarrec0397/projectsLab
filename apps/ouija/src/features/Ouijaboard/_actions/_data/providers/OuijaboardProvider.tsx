import { HasChildren } from "@projectslab/helpers";
import { createContext, Dispatch, FC, SetStateAction, useContext, useState } from "react";

import { OuijaboardMessage } from "@/features/Ouijaboard/ouijaBoardTypes";

export interface OuijaboardContextModel {
    messages: OuijaboardMessage[];
    setMessages: (() => void) | Dispatch<SetStateAction<OuijaboardMessage[]>>;
    entityIndex?: number;
    setEntityIndex: (() => void) | Dispatch<SetStateAction<number | undefined>>;
}

export const defaultContext: OuijaboardContextModel = {
    messages: [],
    setMessages: () => {},
    setEntityIndex: () => {},
};

export const OuijaboardContext = createContext<OuijaboardContextModel>(defaultContext);

type Props = HasChildren;

export const useOuijaboardContext = () => {
    return useContext(OuijaboardContext);
};

const OuijaboardContextProvider: FC<Props> = ({ children }) => {
    const [messages, setMessages] = useState<OuijaboardMessage[]>([]);
    const [entityIndex, setEntityIndex] = useState<number>();

    const providerValue: OuijaboardContextModel = {
        messages,
        setMessages,
        entityIndex,
        setEntityIndex,
    };

    return (
        <OuijaboardContext.Provider value={providerValue}>{children}</OuijaboardContext.Provider>
    );
};

export default OuijaboardContextProvider;
