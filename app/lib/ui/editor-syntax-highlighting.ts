import {Node, Parser} from 'commonmark'
import {ContentBlock, ContentState, EditorState, SelectionState, Modifier} from 'draft-js'

const parser = new Parser()

const headerType = {
  1: 'header-one',
  2: 'header-two',
  3: 'header-three',
}

function maybeSet(block: ContentBlock, type: string) {
  if (block.get('type') !== type) {
    return block.set('type', type)
  }
}

function walkChildren(node: Node, fn: (node: Node) => void) {
  let child = node.firstChild
  do {
    fn(child)
  } while (child = child.next)
}

function getLength(node: Node) {
  if (node.isContainer) {
    let length = 0
    walkChildren(node, child => length += getLength(child))
    return length
  } else {
    return (node.literal && node.literal.length) || 0
  }
}

function updateInlineStyles(content: ContentState, blockKey: string, node: Node) {
  let start = 0
  let updatedContent = content

  walkChildren(node, child => {
    let end = start + getLength(child)
    const selection = SelectionState.createEmpty(blockKey).merge({
      anchorOffset: start,
      focusKey: blockKey,
      focusOffset: end,
    })

    if (child.type === 'Emph') {
      updatedContent = Modifier.applyInlineStyle(updatedContent, selection, 'ITALIC')
    } else if (child.type === 'Strong') {
      updatedContent = Modifier.applyInlineStyle(updatedContent, selection, 'BOLD')
    } else if (child.type === 'Code') {
      updatedContent = Modifier.applyInlineStyle(updatedContent, selection, 'CODE')
    }

    start = end + 1
  })

  return updatedContent === content ? null : updatedContent
}

export function updateStyles(editor: EditorState) {
  const key = editor.getSelection().getFocusKey()
  const content = editor.getCurrentContent()
  const block = content.getBlockForKey(key)
  const ast = parser.parse(block.getText())

  let updatedBlock: ContentBlock
  let updatedContent: ContentState
  if (ast.firstChild === ast.lastChild && ast.firstChild) {
    const node = ast.firstChild

    if (node.type === 'Heading') {
      const type = headerType[ast.firstChild.level] || 'unstyled'

      updatedBlock = maybeSet(block, type)
    } else if (node.type === 'BlockQuote') {
      updatedBlock = maybeSet(block, 'blockquote')
    // } else if (node.type === 'Paragraph' && node.firstChild !== node.lastChild) {
    //   updatedContent = updateInlineStyles(content, block.getKey(), node)
    } else {
      updatedBlock = maybeSet(block, 'unstyled')
    }
    /// goal question metiric, victor basili
    /// Program slicing, component based systems
  } else {
    updatedBlock = maybeSet(block, 'unstyled')
  }

  if (updatedBlock) {
    updatedContent = content.setIn(['blockMap', key], updatedBlock)
  }
  if (updatedContent) {
    const selection = editor.getSelection()
    updatedContent = updatedContent.merge({
      selectionBefore: selection,
      selectionAfter: selection,
    })

    return EditorState.push(editor, updatedContent, 'change-block-type')
  }

  return editor
}

export function getCurrentRow(content: ContentState, selection: SelectionState) {
  let currentRow = 1
  let key = selection.getFocusKey()
  while (key = content.getKeyBefore(key)) {
    currentRow++
  }
  return currentRow
}

export function modifyInlineStyle(
  editor: EditorState, selection: SelectionState, {apply, remove}: {apply?: string, remove?: string}
) {
  let content = editor.getCurrentContent()
  if (remove) {
    content = Modifier.removeInlineStyle(content, selection, remove)
  }
  if (apply) {
    content = Modifier.applyInlineStyle(content, selection, apply)
  }

  return EditorState.push(editor, content, 'change-inline-style')
}
