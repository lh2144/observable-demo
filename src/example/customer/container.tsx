import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    debounceTime,
    distinctUntilChanged,
    of,
    Subject,
    Subscription,
    switchMap,
} from "rxjs";
import { useStore } from "src/hooks/useStore";
import CustomerStore, { CustomerState } from "../services/customer.service";
import CustomerList from "./customerList";

interface props {}
const Index = (props: props): JSX.Element => {
    const [state] = useStore<CustomerState>(CustomerStore);
    const [input, setInput] = useState("");
    const subscription = useRef<Subscription>();
    const subject = useRef<Subject<string>>(new Subject());
    useEffect(() => {
        CustomerStore.getCustomers();
    }, []);

    useEffect(() => {
        subscription.current = subject.current
            ?.pipe(debounceTime(500), distinctUntilChanged())
            .subscribe((target) => {
                console.log("target", target);
                setInput(target)

            });
        return () => subscription.current?.unsubscribe();
    }, []);
    console.log("state", state);

    const handleChange = useCallback((e: any) => {
        subject.current.next(e.target?.value);
    }, []);

    const style = {
        width: "50%",
        display: 'block',
        margin: "auto",
        border: "1px solid blue",
        marginBottom: '6px',
        height: '32px',
        fontSize: '24px'
    }
    return (
        <>
            <input
                style={style}
                name="test"
                type={"text"}
                onKeyUp={handleChange}
            />
            <div style={style}>
                your input: {input}
            </div>
            <CustomerList customers={state.customers} />
        </>
    );
};

export default Index;
