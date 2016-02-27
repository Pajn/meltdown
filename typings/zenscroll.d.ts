declare module 'zenscroll' {
  export function to(element: Element, duration?: number, edgeOffset?: number)
  export function toY(px: number)
  export function intoView(element: Element, duration?: number, edgeOffset?: number)
  export function center(element: Element, duration?: number, edgeOffset?: number)

  export function createScroller(element: Element, defaultDuration?: number, edgeOffset?: number): {
      to(element: Element, duration?: number, edgeOffset?: number)
      toY(px: number)
      intoView(element: Element, duration?: number, edgeOffset?: number)
      center(element: Element, duration?: number, edgeOffset?: number)
  }
}
