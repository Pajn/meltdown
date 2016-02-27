import {convertFromRaw, convertToRaw, ContentState} from 'draft-js'
import css from 'insert-css-module'
import debounce from 'lodash/debounce'
import * as React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import {compose} from 'redux'
import withState from 'recompose/withState'
import {togglePreview} from '../actions/document'
import {scrollTo} from '../lib/ui/scroll'
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

const save = debounce(content => {
  localStorage.setItem('content', JSON.stringify(convertToRaw(content)))
}, 1000)

const initialContent = (() => {
  const stored = JSON.parse(localStorage.getItem('content'))
  if (!stored) return

  return ContentState.createFromBlockArray(convertFromRaw(stored))
})()

const initialState = initialContent
    ? initialContent.getPlainText()
    : ''

type Properties = {
  file: File
}

export const Document = compose(
  withState('markdown', 'setMarkdown', initialState),
  connect(
    (state, props) => ({showPreview: state.editorSettings.showPreview}),
    dispatch => ({togglePreview: () => dispatch(togglePreview)})
  )
)(({file: {path}, markdown, setMarkdown, showPreview, togglePreview}) => {
  let preview

  return (
    <div className={styles('container')}>
      <Panel>
        <Link to={getUrl(path)}>Back</Link>
        <Whitespace />
        <button onClick={togglePreview}>
          Toggle Preview
        </button>
      </Panel>
      <div className={styles('editing-container')}>
        <div className={styles('flex')}>
          <Editor initialContent={initialContent} onRowChange={row => scrollTo(row, preview)}
                  onChange={content => {
                    setMarkdown(content.getPlainText())
                    save(content)
                  }} />
        </div>
        {
          showPreview &&
          <div className={styles('flex')} ref={element => preview = element}>
            <Preview markdown={markdown} />
          </div>
        }
      </div>
    </div>
  )
})
