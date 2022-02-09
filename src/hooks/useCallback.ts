import React, { useRef, useCallback, useEffect, useState } from 'react';
import { Observable, Subject, Subscription } from 'rxjs';

type EventCallback = <EventValue, State>(
  eventSource: Observable<EventValue>
) => Observable<State>;

const useEventCallback = <Event, State>(callback: EventCallback, initialState: State): [(e: Event) => void, State] => {
  const [state, setState] = useState(initialState)

  const event$ = useRef<Subject<Event>>(new Subject<Event>());

  const eventCallback = (e: Event) => {
    event$.current.next(e);
  };

  const returnedCallBack = useCallback(eventCallback, []);

  useEffect(() => {
    const value$: Observable<State> = callback(event$.current)

    const subscription = value$.subscribe((value) => setState(value))
    return () => {
      subscription.unsubscribe()
      event$.current.complete()
    }
  }, [])
  return [returnedCallBack, state]
};

export default useEventCallback;
