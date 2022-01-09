import { BehaviorSubject } from "rxjs";
import { StateResult } from "../BaseStore";

export const createState = <T>(initState: T): StateResult<T> => {
  const stateSubject = new BehaviorSubject<T>(initState)
  return {
    state$: stateSubject.asObservable(),
    setState(val: any) {
      const preState = stateSubject.getValue()
      stateSubject.next({...preState, ...val})
    },
    getState() {
      return stateSubject.getValue()
    }
  }
}