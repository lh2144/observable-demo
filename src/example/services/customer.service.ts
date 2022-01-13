/* eslint-disable @typescript-eslint/no-useless-constructor */
import { from } from 'rxjs';
import { BaseStore } from 'src/core/BaseStore';
import { Cachable } from 'src/core/cache.service';

export interface CustomerState {
  customers: { username: string; phone: number }[];
}
const initial = { customers: [], counter: 1 };

class Customer extends BaseStore<CustomerState> {
  constructor(initialState: CustomerState) {
    super(initialState);
  }

  @Cachable({cachecForEver: true, clearOn: ['update']})
  public fetchCustomer() {
    return from(
      fetch('https://jsonplaceholder.typicode.com/users', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        mode: 'cors',
      }).then((res) => {
        return res.json();
      })
    );
  }

  public fetchCustomerByName(name: string) {
    return from(
        fetch(`https://jsonplaceholder.typicode.com/users?username=${name}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            mode: 'cors'
        }).then((res) => res.json())
    )
  }

  public setCustomers() {
    this.fetchCustomer().subscribe((res) => this.setState({customers: res}));
  }

  get storeStates() {
    return this.getAllState()
  }


}

export default new Customer(initial);
