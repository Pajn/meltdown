import {convertFromRaw, convertToRaw, ContentState, SelectionState} from 'draft-js'
import css from 'insert-css-module'
import debounce from 'lodash/debounce'
import * as React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import {compose} from 'redux'
import {StartAddingComment, togglePreview} from '../actions/document'
import {DocumentState} from '../lib/reducers/document'
import {scrollTo} from '../lib/ui/scroll'
import {File} from '../lib/entities'
import {getUrl} from '../lib/file-tools'
import {Editor} from './editor'
import {Panel, Whitespace} from './panel'
import {Preview} from './preview'

const styles = css`
  .container, .editing-container {
    display: flex;
    alignItems: stretch;
    height: 100%;
  }

  .container {
    flex-direction: column;
  }

  .editing-container blockquote {
    color: rgba(0, 0, 0, 0.56);
    font-size: 0.8em;
    font-style: italic;
  }

  .editing-container h1 + blockquote,
  .editing-container h2 + blockquote,
  .editing-container h3 + blockquote,
  .editing-container blockquote + blockquote {
    margin-top: -0.5em;
  }

  .flex {
    position: relative;
    flex: 1;
    overflow: auto;
  }
`

type Properties = {
  file: File
}

type State = {
  file: File
  content: ContentState
  selection: SelectionState
  markdown: string
  creatingComment: boolean
}

type InnerProps = Properties & {
  state: State
  dispatch: (action) => void
  document: DocumentState
  showPreview: boolean
  togglePreview: () => void
  startAddingComment: () => void
}

const parseContent = compose(
  ContentState.createFromBlockArray,
  convertFromRaw,
  JSON.parse
)

const getKey = ({path, slug}: File) => `file: ${path.join('/')}/${slug}`

const saveContent = debounce((file, content) => {
  localStorage.setItem(
    getKey(file),
    JSON.stringify(convertToRaw(content)))
}, 1000)

const initialState = ({file}: Properties) => {
  const stored = localStorage.getItem(getKey(file))
  if (!stored) {
    return {content: null, markdown: '', file}
  }

  const content = parseContent(stored)
  const markdown = content.getPlainText()

  return {content, markdown, file}
}

export const Document = connect(
  state => ({
    document: state.document,
    showPreview: state.editorSettings.showPreview,
  }),
  (dispatch, {file}) => ({
    startAddingComment: () => dispatch(StartAddingComment(file)),
    togglePreview: () => dispatch(togglePreview),
  })
)<Properties>(({
  file: {path}, document, showPreview,
  startAddingComment, togglePreview,
}: InnerProps) => {
  let preview

  return (
    <div className={styles('container')}>
      <Panel>
        <Link to={getUrl(path)}>Back</Link>
        <button onClick={startAddingComment}>
          Comment
        </button>
        <Whitespace />
        <button onClick={togglePreview}>
          Toggle Preview
        </button>
      </Panel>
      <div className={styles('editing-container')}>
        <div className={styles('flex')}>
          <Editor onRowChange={row => scrollTo(row, preview)} />
        </div>
        {
          showPreview &&
          <div className={styles('flex')} ref={element => preview = element}>
            <Preview markdown={document.markdown} />
          </div>
        }
      </div>
    </div>
  )
})
