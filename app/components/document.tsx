import {convertFromRaw, convertToRaw, ContentState} from 'draft-js'
import css from 'insert-css-module'
import debounce from 'lodash/debounce'
import * as React from 'react'
import {connect} from 'react-redux'
import {compose} from 'redux'
import withState from 'recompose/withState'
import {togglePreview} from '../actions/document'
import {scrollTo} from '../lib/ui/scroll'
import {Editor} from './editor'
import {Preview} from './preview'

const styles = css`
  .container {
    display: flex;
    alignItems: stretch;
    height: 100%;
  }

  .container blockquote {
    color: rgba(0, 0, 0, 0.56);
    font-size: 0.8em;
    font-style: italic;
  }

  .container h1 + blockquote,
  .container h2 + blockquote,
  .container h3 + blockquote,
  .container blockquote + blockquote {
    margin-top: -0.5em;
  }

  .flex {
    position: relative;
    flex: 1;
    overflow: auto;
  }

  .toggle {
    position: absolute;
    top: 16;
    right: 16;
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

export const Document = compose(
  withState('markdown', 'setMarkdown', initialState),
  connect(
    (state, props) => ({showPreview: state.editorSettings.showPreview}),
    dispatch => ({togglePreview: () => dispatch(togglePreview)})
  )
)(({markdown, setMarkdown, showPreview, togglePreview}) => {
  let preview

  return (
    <div className={styles('container')}>
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
      <button className={styles('toggle')} onClick={togglePreview}>
        Toggle Preview
      </button>
    </div>
  )
})
