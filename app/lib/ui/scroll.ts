import {createScroller} from 'zenscroll'

export function scrollTo(row: number, element: HTMLElement) {
  if (!element) return

  const scroller = createScroller(element)
  const rowElement = element.querySelector(`[data-sourcepos^="${row}:"]`)
  if (!rowElement) return

  scroller.center(rowElement)
}
