/* eslint-disable react-hooks/rules-of-hooks */
import React, { ComponentType, useMemo } from "react";
import { BaseStore } from "src/core/BaseStore";
import { useStore } from "./useStore";

export const Connect = (
    storeClass: InstanceType<typeof BaseStore>
) => {
    const allState = storeClass.getAllState();
    return function ConnectCmp(Component: React.FC<any>) {
        return (props: any) => {
            const [state] = useStore<any>(storeClass)
            return useMemo(() => <Component {...props} state={{...state}} />, [state]);
        };
    };
};
