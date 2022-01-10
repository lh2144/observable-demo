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
    const [state] = useStore<CustomerState, any>(CustomerStore);
    const [list, setList] = useState<any>(state.customers)
    const subscription = useRef<Subscription>();
    const subject = useRef<Subject<string>>(new Subject());
    useEffect(() => {
        CustomerStore.setCustomers();
    }, []);
    useEffect(() => {
        setList(state.customers)
    }, [state])
    useEffect(() => {
        subscription.current = subject.current
            ?.pipe(debounceTime(1000), distinctUntilChanged(), switchMap((input) => {
                return CustomerStore.fetchCustomerByName(input)
            }))
            .subscribe((target) => {
                console.log("target", target);
                if (target.length === 0) {
                    setList(CustomerStore.getCustomers().customers)
                    return
                }
                setList(target)

            });
        return () => subscription.current?.unsubscribe();
    }, []);

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

            <CustomerList customers={list} />
        </>
    );
};

export default Index;
