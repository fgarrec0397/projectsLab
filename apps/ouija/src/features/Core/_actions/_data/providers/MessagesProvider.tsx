import { HasChildren } from "@projectslab/helpers";
import { createContext, Dispatch, FC, SetStateAction, useState } from "react";

import { Message } from "@/features/Core/coreTypes";

export interface MessagesContextModel {
    messages: Message[];
    setMessages: (() => void) | Dispatch<SetStateAction<Message[]>>;
}

export const defaultContext: MessagesContextModel = {
    messages: [],
    setMessages: () => {},
};

export const MessagesContext = createContext<MessagesContextModel>(defaultContext);

type Props = HasChildren;

const MessagesContextProvider: FC<Props> = ({ children }) => {
    const [messages, setMessages] = useState<Message[]>([]);

    const providerValue: MessagesContextModel = {
        messages,
        setMessages,
    };

    return <MessagesContext.Provider value={providerValue}>{children}</MessagesContext.Provider>;
};

export default MessagesContextProvider;
