import { Observable } from "rxjs"
import { createState } from "./utils/createState"

export interface StateResult<T> {
  state$: Observable<T>
  getState(): T
  setState(val: any): void
}
interface Config {
  stateHistory: boolean
  logState: boolean
}

export class BaseStore<s> {

  private state: StateResult<s>
  constructor(defaultState: s, setting?: Config) {
    this.state = createState(defaultState)
    this.stateChange = this.state.state$
  }

  public setState(val: Partial<s>) {
    this.state.setState(val)
  }

  public stateChange: Observable<s>

  public getState(selector?: (state: s) => any): s | Partial<s> | any {
    const state = this.state.getState()
    if (selector) {
      return selector(state)
    }
    return state
  }

  public getAllState(): s {
    return this.state.getState()
  }
  // public getState$() {
  //   return this.state.state$
  // }

}