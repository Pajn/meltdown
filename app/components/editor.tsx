import {Editor as DraftJs, EditorState} from 'draft-js'
import css from 'insert-css-module'
import * as React from 'react'
import {connect} from 'react-redux'
import withState from 'recompose/withState'
import {compose} from 'redux'
import {cancelComment, CreateComment, EditorChanged, FocusComment} from '../actions/document'
import {getCurrentRow} from '../lib/ui/editor-syntax-highlighting'
import {Comment} from '../lib/entities'
import {CommentBox} from './comment-box'
import {CreateCommentBox} from './create-comment-box'

const styles = css`
  .editor {
    position: relative;
  }

  .comments {
    position: absolute;
    right: 10px;
  }
`

const styleMap = {
  comment: {backgroundColor: 'rgba(255, 255, 0, 0.4)'},
  focusedComment: {backgroundColor: 'rgba(255, 0, 0, 0.8)'},
}

type Properties = {
  onRowChange?: (newRow: number) => void
}

type InnerProps = Properties & {
  comments: Comment[]
  creatingComment?: any
  focusedComment?: any
  editor: EditorState
  editorChanged: (editor: EditorState) => void
  cancelComment: () => void
  createComment: (text: string) => void
  focusComment: (id: number) => void

  state: {row: number}
  setState: (state: {row: number}) => void
}

// const initialEditor = ({initialContent}: Properties) => initialContent
//   ? EditorState.createWithContent(initialContent)
//   : EditorState.createEmpty()

const DebugMetadata = ({editor}: {editor: EditorState}) =>
  <div>
    {
      (() => {
        let map = editor.getCurrentContent().getBlockMap()
        let list = map.toList()
        let JSX = []
        for (let i = 0; i < list.size; i++) {
          let block = list.get(i)
          JSX.push(
            <div>
              BLOCK: { (() => {
                let text = block.getText()
                let chars = block.getCharacterList()
                let JSX = []
                for (let i = 0; i < chars.size; i++) {
                  let metadata = chars.get(i)
                  JSX.push(<span>
                    {text[i]}
                    {metadata.getEntity()}_
                  </span>)
                }
                return JSX
              })()}
            </div>
          )
        }
        return JSX
      })()
    }
  </div>

export const Editor = compose(
  withState('state', 'setState', {}),
  connect(
    state => ({
      comments: state.document.comments,
      creatingComment: state.document.creatingComment,
      focusedComment: state.document.focusedComment,
      editor: state.document.editor,
    }),
    dispatch => ({
      cancelComment: () => dispatch(cancelComment),
      createComment: text => dispatch(CreateComment(text)),
      editorChanged: editor => dispatch(EditorChanged(editor)),
      focusComment: id => dispatch(FocusComment(id)),
    })
  )
)(({
  comments, creatingComment, focusedComment, editor,
  cancelComment, createComment, editorChanged, focusComment,
  onRowChange, state: {row}, setState,
}: InnerProps) =>
    <div className={styles('editor')}>
      <DraftJs editorState={editor} spellCheck stripPastedStyles customStyleMap={styleMap}
          onChange={editor => {
            if (onRowChange) {
              const content = editor.getCurrentContent()
              let currentRow = getCurrentRow(content, editor.getSelection())
              if (row !== currentRow) {
                onRowChange(currentRow)
                setState({row: currentRow})
              }
            }

            editorChanged(editor)
          }}
          blockStyleFn={block => {
            const type = block.getType()
            if (type === 'header-three') {
              return 'h3'
            }
          }} />
      <DebugMetadata editor={editor} />
      <div className={styles('comments')}>
        {
          comments.map(comment =>
            <CommentBox comment={comment} key={comment.id}
                        focused={focusedComment && comment.id === focusedComment.id}
                        handleFocus={() => focusComment(comment.id)} />
          )
        }
        {
          creatingComment &&
          <CreateCommentBox cancelComment={cancelComment} createComment={createComment} />
        }
      </div>
    </div>
)
