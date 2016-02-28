import {EditorState} from 'draft-js'
import {Action} from 'redux-decorated'
import {withPayload} from '../lib/action-creator'

type DeboucedAction<P> = Action<P> & {meta: {debounce: {time: number}}}

export const updateMarkdown: DeboucedAction<{}> = {
  type: 'updateMarkdown',
  meta: {debounce: {time: 100}},
}
export const editorChanged: Action<{editor: EditorState}> = {type: 'editorChanged'}
export const startAddingComment: Action<{file: File}> = {type: 'startAddingComment'}
export const cancelComment: Action<{}> = {type: 'cancelComment'}
export const createComment: Action<{text: string}> = {type: 'createComment'}
export const focusComment: Action<{id: number}> = {type: 'focusComment'}
export const togglePreview: Action<{}> = {type: 'togglePreview'}

export const EditorChanged = (editor: EditorState) => dispatch => {
  dispatch(withPayload(editorChanged, {editor}))
  dispatch(updateMarkdown)
}
export const StartAddingComment = (file: File) => withPayload(startAddingComment, {file})
export const CreateComment = (text: string) => withPayload(createComment, {text})
export const FocusComment = (id: number) => withPayload(focusComment, {id})
