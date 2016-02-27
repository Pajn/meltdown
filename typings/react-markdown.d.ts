declare module 'react-markdown' {
  export default function(props: {
    source: string
    className?: string
    skipHtml?: boolean
    escapeHtml?: boolean
    sourcePos?: boolean
    walker?: Function
  }): JSX.Element
}

declare module 'commonmark' {
  export class Node {
    title: string
    type: string
    destination: string
    isContainer: boolean
    level: number
    literal: string

    parent: Node
    firstChild: Node
    lastChild: Node
    next: Node
    prev: Node

    constructor(type: string)

    appendChild(child: Node)
    insertBefore(sibling: Node)
    unlink()
  }

  export class Parser {
    parse(markdown: string): Node
  }
}
