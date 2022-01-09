import { useEffect, useState } from "react";
// import { isEqual } from "lodash";
import { BaseStore } from "src/core/BaseStore";
export interface Construcof<T> {
    new (...arg: any[]): T
}
export const useStore = <S>(storeClass: InstanceType<typeof BaseStore>) => {
    const [state, setState] = useState<S>((storeClass as any).getAllState());
    // const stateRef = useRef(state)

    const setStoreState = (s: { [key: string]: any }) => {
        if (!s) {
            return;
        }
        const resState = {...state, ...s}
        setState(resState)
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
