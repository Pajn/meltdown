declare module 'draft-js' {
  import {Component, KeyboardEvent} from 'react'

  class Map {
    get(key: string): any
    merge(...iterables: {[key: string]: any}[]): this
    set(key: string, value): this
    setIn(path: string[], value): this
  }

  type DraftInlineStyle = Immutable.OrderedSet<string>
  type BlockMap = Immutable.OrderedMap<string, ContentBlock>

  /**
   * An enum representing the possible "mutability" options for an entity.
   * This refers to the behavior that should occur when inserting or removing
   * characters in a text range with an entity applied to it.
   *
   * `MUTABLE`:
   *   The text range can be modified freely. Generally used in cases where
   *   the text content and the entity do not necessarily have a direct
   *   relationship. For instance, the text and URI for a link may be completely
   *   different. The user is allowed to edit the text as needed, and the entity
   *   is preserved and applied to any characters added within the range.
   *
   * `IMMUTABLE`:
   *   Not to be confused with immutable data structures used to represent the
   *   state of the editor. Immutable entity ranges cannot be modified in any
   *   way. Adding characters within the range will remove the entity from the
   *   entire range. Deleting characters will delete the entire range. Example:
   *   Facebook Page mentions.
   *
   * `SEGMENTED`:
   *   Segmented entities allow the removal of partial ranges of text, as
   *   separated by a delimiter. Adding characters wihin the range will remove
   *   the entity from the entire range. Deleting characters within a segmented
   *   entity will delete only the segments affected by the deletion. Example:
   *   Facebook User mentions.
   */
  type DraftEntityMutability =
    'MUTABLE' |
    'IMMUTABLE' |
    'SEGMENTED'

  type EditorChangeType =
    'undo' |
    'redo' |
    'change-selection' |
    'insert-characters' |
    'backspace-character' |
    'delete-character' |
    'remove-range' |
    'split-block' |
    'insert-fragment' |
    'change-inline-style' |
    'change-block-type' |
    'apply-entity' |
    'reset-block' |
    'adjust-depth' |
    'spellcheck-change'

  type DraftEntityType =
    'unstyled' |
    'paragraph' |
    'header-one' |
    'header-two' |
    'unordered-list-item' |
    'ordered-list-item' |
    'blockquote' |
    'pullquote' |
    'code-block' |
    'media'

  type CharacterMetadataConfig = {
    style?: DraftInlineStyle
    entity?: string
  }

  /**
   * An instance of a document entity, consisting of a `type` and relevant
   * `data`, metadata about the entity.
   *
   * For instance, a "link" entity might provide a URI, and a "mention"
   * entity might provide the mentioned user's ID. These pieces of data
   * may be used when rendering the entity as part of a ContentBlock DOM
   * representation. For a link, the data would be used as an href for
   * the rendered anchor. For a mention, the ID could be used to retrieve
   * a hovercard.
   */
  class DraftEntityInstance {
    getType(): string
    getMutability(): DraftEntityMutability
    getData(): any
  }

  /**
   * A "document entity" is an object containing metadata associated with a
   * piece of text in a ContentBlock.
   *
   * For example, a `link` entity might include a `uri` property. When a
   * ContentBlock is rendered in the browser, text that refers to that link
   * entity may be rendered as an anchor, with the `uri` as the href value.
   *
   * In a ContentBlock, every position in the text may correspond to zero
   * or one entities. This correspondence is tracked using a key string,
   * generated via Entity.create() and used to obtain entity metadata
   * via Entity.get().
   */
  export const Entity: {
    /**
     * Create a DraftEntityInstance and store it for later retrieval.
     *
     * A random key string will be generated and returned. This key may
     * be used to track the entity's usage in a ContentBlock, and for
     * retrieving data about the entity at render time.
     */
    create(
      type: string,
      mutability: DraftEntityMutability,
      data?: Object
    ): string

    /**
     * Add an existing DraftEntityInstance to the DraftEntity map. This is
     * useful when restoring instances from the server.
     */
    add(instance: DraftEntityInstance): string

    /**
     * Retrieve the entity corresponding to the supplied key string.
     */
    get(key: string): DraftEntityInstance

    /**
     * Entity instances are immutable. If you need to update the data for an
     * instance, this method will merge your data updates and return a new
     * instance.
     */
    mergeData(
      key: string,
      toMerge: {[key: string]: any}
    ): DraftEntityInstance

    /**
     * Completely replace the data for a given instance.
     */
    replaceData(
      key: string,
      newData: {[key: string]: any}
    ): DraftEntityInstance
  }

  export class CharacterMetadata extends Map {
    static create(config?: CharacterMetadataConfig): CharacterMetadata
    static applyStyle(record: CharacterMetadata, style: string): CharacterMetadata
    static removeStyle(record: CharacterMetadata, style: string): CharacterMetadata
    static applyEntity(record: CharacterMetadata, entityKey?: string): CharacterMetadata
    getStyle(): DraftInlineStyle
    hasStyle(style: string): boolean
    getEntity(): string
  }

  export class ContentBlock extends Map {
    getKey(): string
    getText(): string
    getType(): DraftEntityType

    getCharacterList(): Immutable.List<CharacterMetadata>
  }

  export class ContentState extends Map {
    static createFromBlockArray(block: ContentBlock[]): ContentState
    getPlainText(): string
    getKeyBefore(key: string): string
    getBlockForKey(key: string): ContentBlock
    getBlockMap(): BlockMap
  }
  export class EditorState {
    static createEmpty(): EditorState
    static createWithContent(content: ContentState): EditorState
    static push(editorState: EditorState, content: ContentState, command: EditorChangeType): EditorState

    getCurrentContent(): ContentState
    getCurrentInlineStyle(): Immutable.OrderedSet<string>
    getSelection(): SelectionState
  }
  export class SelectionState extends Map {
    static createEmpty(blockKey: string): SelectionState
    getAnchorKey(): string
    getAnchorOffset(): number
    getFocusKey(): string
    getFocusOffset(): number
    getIsBackward(): boolean

    isCollapsed(): boolean
    hasEdgeWithin(blockKey: string, start: number, end: number): boolean
    serialize(): string
  }
  export class Editor extends Component<{
    editorState: EditorState
    onChange: (state: EditorState) => void
    blockStyleFn?: (block: ContentBlock) => void|string|{component?, props?}
    handleBeforeInput?: (e: string) => void
    handleReturn?: (e: KeyboardEvent) => void
    customStyleMap?: {[inlineStyle: string]: Object}
    spellCheck?: boolean
    stripPastedStyles?: boolean
  }, {}> {}
  export const Modifier: {
    applyInlineStyle(content: ContentState, selection: SelectionState, inlineStyle: string): ContentState
    removeInlineStyle(content: ContentState, selection: SelectionState, inlineStyle: string): ContentState
    splitBlock(content: ContentBlock, selection: SelectionState): ContentBlock
  }

  export function convertFromRaw(content: Object): ContentBlock[]
  export function convertToRaw(content: ContentState): Object
}
