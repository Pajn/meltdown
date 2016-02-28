import {ContentState, EditorState, SelectionState, CharacterMetadata, Entity} from 'draft-js'
import {createReducer, updateIn} from 'redux-decorated'
import {
  editorChanged, updateMarkdown,
  startAddingComment, cancelComment, createComment,
} from '../../actions/document'
import {modifyInlineStyle, updateStyles} from '../ui/editor-syntax-highlighting'
import {Comment} from '../entities'

export type DocumentState = {
  creatingComment: SelectionState
  focusedComment: Comment
  comments: Comment[]
  editor: EditorState
  markdown: string
}
const initialState = {
  creatingComment: null,
  focusedComment: null,
  comments: [],
  editor: EditorState.createEmpty(),
  markdown: '',
}

function getCurrentComment(selection: SelectionState, content: ContentState) {
  if (!selection.isCollapsed()) return

  const block = content.getBlockForKey(selection.getAnchorKey())
  const metadata = block.getCharacterList().get(selection.getAnchorOffset())
  if (!metadata) return
  const entityKey = metadata.getEntity()
  const entity = entityKey && Entity.get(entityKey)
  if (entity && entity.getType() === 'Comment') {
    return entity.getData().id
  }
}

function focusComment(content: ContentState, comment: Comment, {focus}: {focus: boolean}) {
  let block = content.getBlockForKey(comment.selection.getAnchorKey())
  let chars = block.getCharacterList()

  for (let i = 0; i < chars.size; i++) {
    let metadata = chars.get(i)
    if (metadata.getEntity() === comment.entityKey) {
      if (focus) {
        metadata = CharacterMetadata.applyStyle(metadata, 'focusedComment')
      } else {
        metadata = CharacterMetadata.removeStyle(metadata, 'focusedComment')
      }
      chars = chars.set(i, metadata)
    }
  }

  block = block.set('characterList', chars)
  return content.set('blockMap', content.getBlockMap().set(block.getKey(), block))
}

function updateComments(state: DocumentState, editor: EditorState) {
  const content = editor.getCurrentContent()
  const selection = editor.getSelection()
  const commentId = getCurrentComment(selection, content)
  let updatedState

  if (typeof commentId === 'number') {
    if (!state.focusedComment || commentId !== state.focusedComment.id) {
      const focusedComment = state.comments[commentId]
      let updatedContent = content

      if (state.focusedComment) {
        updatedContent = focusComment(updatedContent, state.focusedComment, {focus: false})
      }

      updatedContent = focusComment(updatedContent, focusedComment, {focus: true})

      updatedState = Object.assign({}, state, {
        editor: EditorState.push(editor, updatedContent, 'change-inline-style'),
        focusedComment,
      })
    }
  } else if (state.focusedComment) {
    const updatedContent = focusComment(content, state.focusedComment, {focus: false})
    updatedState = Object.assign({}, state, {
      editor: EditorState.push(editor, updatedContent, 'change-inline-style'),
      focusedComment: null,
    })
  }

  if (!updatedState) {
    updatedState = updateIn('editor', editor, state)
  }

  return updatedState
}

function flipIfBackwards(selection: SelectionState) {
  if (selection.getIsBackward()) {
    return selection.merge({
      anchorOffset: selection.getFocusOffset(),
      focusOffset: selection.getAnchorOffset(),
      isBackward: false,
    })
  }
  return selection
}

export const document = createReducer<DocumentState>(initialState)
  .when(editorChanged, (state: DocumentState, {editor}) => {
    editor = updateStyles(editor)
    return updateComments(state, editor)
  })
  .when(updateMarkdown, (state: DocumentState, _) => {
    const content = state.editor.getCurrentContent()
    const markdown = content.getPlainText()
    return updateIn('markdown', markdown, state)
  })
  .when(startAddingComment, (state: DocumentState, _) => {
    const selection = flipIfBackwards(state.editor.getSelection())
    return Object.assign({}, state, {
      editor: modifyInlineStyle(state.editor, selection, {apply: 'focusedComment'}),
      creatingComment: selection,
    })
  })
  .when(cancelComment, (state: DocumentState, _) => Object.assign({}, state, {
    editor: modifyInlineStyle(state.editor, state.creatingComment, {remove: 'focusedComment'}),
    creatingComment: null,
  }))
  .when(createComment, (state: DocumentState, {text}) => {
    const selection = flipIfBackwards(state.editor.getSelection())
    const id = state.comments.length
    const entityKey = Entity.create('Comment', 'MUTABLE', {id})
    let content = state.editor.getCurrentContent()
    if (selection.getAnchorKey() === selection.getFocusKey()) {
      const start = selection.getAnchorOffset()
      const end = selection.getFocusOffset()
      let block = content.getBlockForKey(selection.getAnchorKey())
      let chars = block.getCharacterList()

      for (let i = start; i < end; i++) {
        let metadata = chars.get(i)
        metadata = CharacterMetadata.applyEntity(metadata, entityKey)
        metadata = CharacterMetadata.applyStyle(metadata, 'comment')
        chars = chars.set(i, metadata)
      }

      block = block.set('characterList', chars)
      content = content.set('blockMap', content.getBlockMap().set(block.getKey(), block))
    }

    const comment = {id, entityKey, selection, text}

    return Object.assign({}, state, {
      editor: EditorState.push(state.editor, content, 'apply-entity'),
      creatingComment: null,
      focusedComment: comment,
      comments: [...state.comments, comment],
    })
  })
