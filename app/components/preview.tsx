import * as React from 'react'
import pure from 'recompose/pure'
import ReactMarkdown from 'react-markdown'
import {createWalker} from '../lib/walker'

export const Preview = pure(
  ({markdown}: {markdown: string}) =>
      <ReactMarkdown source={markdown} className='preview' sourcePos={true}
                     escapeHtml={true} walker={createWalker()} />
)
