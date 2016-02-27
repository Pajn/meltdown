import {Editor as DraftJs, ContentState, EditorState} from 'draft-js'
import * as React from 'react'
import withState from 'recompose/withState'
import {updateStyles} from '../lib/ui/editor-syntax-highlighting'

type Properties = {
  initialContent?: ContentState,
  onChange: (content: ContentState) => void
  onRowChange?: (newRow: number) => void
}

type InnerProps = Properties & {state: any, setState: any}

const initialEditor = ({initialContent}: Properties) => initialContent
  ? EditorState.createWithContent(initialContent)
  : EditorState.createEmpty()

export const Editor = withState<Properties>(
  'state', 'setState', props => ({editor: initialEditor(props)})
)(({onChange, onRowChange, state: {editor, row}, setState}: InnerProps) =>
    <DraftJs editorState={editor} spellCheck stripPastedStyles onChange={editor => {
      const content = editor.getCurrentContent()
      onChange(content)

      let currentRow
      if (onRowChange) {
        currentRow = 1
        let key = editor.getSelection().getFocusKey()
        while (key = content.getKeyBefore(key)) {
          currentRow++
        }
        if (row !== currentRow && onRowChange) {
          onRowChange(currentRow)
        }
      }

      editor = updateStyles(editor)

      setState({editor, row: currentRow})
    }}
    blockStyleFn={block => {
      const type = block.getType()
      if (type === 'header-three') {
        return 'h3'
      }
    }} />
)
