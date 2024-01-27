import React, { createContext } from "react";

export type Action = { type: string; payload: any; }

export interface State {
    token: string,
    userData: any;
}

export interface PortalContextType {
    state: State;
    dispatch: React.Dispatch<Action>;
}

export const PortalContext = createContext<PortalContextType | undefined>(undefined);

export function usePortalContext() {
    const context = React.useContext(PortalContext);
    if (context === undefined) {
        throw new Error("usePortalContext must be used within a PortalContextProvider");
    }
    return context;
}

export function reducer(state: State, action: Action): State {
    switch (action.type) {
        case "SET_USER_DATA":
            return { ...state, userData: action.payload };
        default:
            return state;
    }
}

export default PortalContext;