/* eslint-disable @typescript-eslint/no-useless-constructor */
import { from } from "rxjs";
import { BaseStore } from "src/core/BaseStore";

export interface  CustomerState {
    customers: {name: string, phone: number}[]
}
const initial = {customers: []}

class Customer extends BaseStore<CustomerState> {
    
    constructor(initialState: CustomerState) {
        super(initialState)
    }

    public fakeFetchCall() {
        const promise = new Promise((res, rej) => {
            setTimeout(() => {
                const customers = [{name: 'jeremy', phone: 123123}, {name: 'hang', phone: 23123}]
                res(customers)
                this.setState({customers})
            }, 1000);
        })
        return from(promise)
    }
    public getCustomers() {
        this.fakeFetchCall()
    }
}

export default new Customer(initial)