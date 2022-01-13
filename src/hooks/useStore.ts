import { useEffect, useState } from "react";
// import { isEqual } from "lodash";
import { BaseStore } from "src/core/BaseStore";
export interface Construcof<T> {
    new (...arg: any[]): T
}

export const useStore = <S, TSelected = unknown>(storeClass: InstanceType<typeof BaseStore>, selector?: (state: S) => TSelected) => {
    const [state, setState] = useState<S | TSelected>((storeClass as any).getAllState());
    // const stateRef = useRef(state)
    const setStoreState = (s: { [key: string]: any }) => {
        if (!s) {
            return;
        }
        const newState = {...state, ...s} as any
        setState(selector ? selector(newState) : newState)
    };
    useEffect(() => {
        const subject = storeClass
            .stateChange
            .subscribe((s: any) => setStoreState(s));
        return () => {
            subject.unsubscribe()
        };
    }, []);
    return [state]
};
