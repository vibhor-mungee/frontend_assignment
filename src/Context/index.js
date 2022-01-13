

import React, { createContext, useContext } from "react";
import { useLazyAxios } from "use-axios-client";
import { API_LOGIN_URL } from "../Utils/constants";


const TOKENContext = createContext();

export function useTOKENContext() {
    return useContext(TOKENContext);
}

export const TOKENContextConsumer = TOKENContext.Consumer;

export function TOKENContextProvider({ children }) {
    
    const options = {
        method: 'POST',
        url: `${API_LOGIN_URL}token`,
        headers: { 'Content-Type': 'application/json',Prefer: 'code=200, dynamic=true' },
        data: {
            phoneNumber: 917000822727, password: "monica123123123123123123",
             scopes: [
                "CONTACTS_READ_ALL", "CONTACTS_CREATE", "ACCOUNT_CREATE", "CONTACTS_READ_ASSIGNED","TAGS_READ"
            ]
        }
    };

    const [callAuthApi,{ data, error }] = useLazyAxios(options);


    const value = {
        data,
        callAuthApi,
        error
    };

    return (
        <TOKENContext.Provider value={value}>
            {children}
        </TOKENContext.Provider>
    );
}
