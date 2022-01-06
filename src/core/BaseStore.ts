import { Observable } from "rxjs"
import { createState } from "./utils/createState"

export interface StateResult<T> {
  state$: Observable<T>
  getState(): T
  setState(val: any): void
}
interface Config {

}
export class BaseStore<s> {

  private state: StateResult<s>
  constructor(defaultState: s, setting?: Config) {
    this.state = createState(defaultState)
  }

  public setState(val: Partial<s>) {
    this.state.setState(val)
  }

  public stateChange(pipeFunc: (input$: Observable<any>) => Observable<any>): Observable<s> {
    if (pipeFunc) {
      return pipeFunc(this.state.state$)
    }
    return this.state.state$
  }

  public getState(selector?: (state: s) => any): s | Partial<s> | any {
    const state = this.state.getState()
    if (selector) {
      return selector(state)
    }
    return state
  }

}