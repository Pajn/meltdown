declare module 'draft-js' {
  import {Component, KeyboardEvent} from 'react'

  class Map {
    get(key: string): any
    merge(...iterables: {[key: string]: any}[]): this
    set(key: string, value): this
    setIn(path: string[], value): this
  }

  export class ContentBlock extends Map {
    getKey(): string
    getText(): string
    getType(): 'unstyled' |
              'paragraph' |
              'header-one' |
              'header-two' |
              'unordered-list-item' |
              'ordered-list-item' |
              'blockquote' |
              'pullquote' |
              'code-block' |
              'media'
  }

  export class ContentState extends Map {
    static createFromBlockArray(block: ContentBlock[]): ContentState
    getPlainText(): string
    getKeyBefore(key: string): string
    getBlockForKey(key: string): ContentBlock
  }
  export class EditorState {
    static createEmpty(): EditorState
    static createWithContent(content: ContentState): EditorState
    static push(editorState: EditorState, content: ContentState, command: string): EditorState

    getCurrentContent(): ContentState
    getSelection(): SelectionState
  }
  export class SelectionState extends Map {
    static createEmpty(blockKey: string): SelectionState
    getFocusKey(): string
    getFocusOffset(): number
  }
  export class Editor extends Component<{
    editorState: EditorState
    onChange: (state: EditorState) => void
    blockStyleFn?: (block: ContentBlock) => void|string|{component?, props?}
    handleBeforeInput?: (e: string) => void
    handleReturn?: (e: KeyboardEvent) => void
    spellCheck?: boolean
    stripPastedStyles?: boolean
  }, {}> {}
  export const Modifier: {
    applyInlineStyle(content: ContentState, selection: SelectionState, inlineStyle: string): ContentState
    splitBlock(content: ContentBlock, selection: SelectionState): ContentBlock
  }

  export function convertFromRaw(content: Object): ContentBlock[]
  export function convertToRaw(content: ContentState): Object
}
