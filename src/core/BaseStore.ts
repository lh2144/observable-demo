import { Observable } from 'rxjs';
import { createState } from './utils/createState';

export interface StateResult<T> {
  state$: Observable<T>;
  getState(): T;
  setState(val: any): void;
}

export type StateFunc<T> = (state: T) => Partial<T>;
interface Config {
  stateHistory?: boolean;
  logState?: boolean;
}

export class BaseStore<s> {
  private state: StateResult<s>;

  constructor(defaultState: s, private setting: Config = { logState: true }) {
    this.state = createState(defaultState);
    this.stateChange = this.state.state$;
  }
  public stateChange: Observable<s>;

  protected setState(val: Partial<s> | StateFunc<s>, action?: any) {
    const preState = this.getAllState();
    switch (typeof val) {
      case 'object':
        this.state.setState(val);
        break;
      case 'function':
        const newState = val(preState);
        this.state.setState(newState);
        break;
      default:
        throw Error('Please pass an object or function to set state');
    }

    if (this.setting.logState) {
      const caller = this.constructor
        ? '\r\nCaller: ' + this.constructor.name
        : '';
      console.log(
        '%cSTATE CHANGED',
        'font-weight: bold',
        '\r\nAction: ',
        action,
        caller,
        '\r\nState: ',
        val
      );
    }
  }

  protected getState(selector?: (state: s) => Partial<s>): s | Partial<s> | any {
    const state = this.state.getState();
    if (selector) {
      return selector(state);
    }
    return state;
  }

  protected getAllState(): s {
    return this.state.getState();
  }
  // public getState$() {
  //   return this.state.state$
  // }
}
