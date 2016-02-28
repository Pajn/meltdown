declare module 'recompose/_types' {
  import {Component} from 'react'

  export interface ComponentClass<P> {
    new (...args): Component<P, any>
  }
}

declare module 'recompose/withReducer' {
  import {ComponentClass} from 'recompose/_types'

  function withReducer<P, S>(
    stateName: string,
    dispatchName: string,
    reducer: (state: S, action) => S,
    initialState: any,
    BaseComponent: (props: P) => JSX.Element
  ): ComponentClass<P>

  function withReducer<S>(
    stateName: string,
    dispatchName: string,
    reducer: (state: S, action) => S,
    initialState: any
  ): <P>(BaseComponent: (props: P) => JSX.Element) => ComponentClass<P>

  function withReducer<P, S>(
    stateName: string,
    dispatchName: string,
    reducer: (state: S, action) => S,
    initialState: any
  ): (BaseComponent: (props: P) => JSX.Element) => ComponentClass<P>

  export default withReducer
}

declare module 'recompose/withState' {
  import {ComponentClass} from 'recompose/_types'

  function withState<P>(
    stateName: string,
    stateUpdaterName: string,
    initialState: any,
    BaseComponent: (props: P) => JSX.Element
  ): ComponentClass<P>

  function withState(
    stateName: string,
    stateUpdaterName: string,
    initialState: any
  ): <P>(BaseComponent: (props: P) => JSX.Element) => ComponentClass<P>

  function withState<P>(
    stateName: string,
    stateUpdaterName: string,
    initialState: any
  ): (BaseComponent: (props: P) => JSX.Element) => ComponentClass<P>

  export default withState
}

declare module 'recompose/pure' {
  import {ComponentClass} from 'recompose/_types'

  export default function<P>(BaseComponent: (props: P) => JSX.Element): ComponentClass<P>
}
