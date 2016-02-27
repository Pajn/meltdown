import {Action} from 'redux-decorated'

type ActionCreator<P> = ((payload: P) => Action<P>) & Action<P>
export class Payload<P> {}

export function action(type: string): (() => Action<{}>) & Action<{}>
export function action<P>(type: string): ActionCreator<P>
export function action<P>(type: string, creator: (payload: P) => Action<P>): ActionCreator<P>
export function action<F, P>(type: string, payload: Payload<P>, creator: F): F & Action<P>

export function action(type: string, payloadDescription?, creator?: Function) {
  if (typeof payloadDescription === 'function') {
    creator = payloadDescription
    payloadDescription = undefined
  }

  const finalCreator = (payload, ...args) => {
    const action = {type}
    if (creator) {
      Object.assign(action, {payload: creator(...args)})
    } else if (typeof payload === 'object' && payload) {
      Object.assign(action, {payload})
    }
    return action
  }
  finalCreator['type'] = type

  return finalCreator
}

export function append<T>(element: T) {
  return (state: T[]) => [...state, element]
}
