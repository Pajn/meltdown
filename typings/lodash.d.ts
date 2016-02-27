declare module 'lodash/debounce' {
  export default function<T extends Function>(fn: T, wait: number): T
}
