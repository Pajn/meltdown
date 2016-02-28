import css from 'insert-css-module'
import * as React from 'react'
import {Comment} from '../lib/entities'

const styles = css`
  .comment-box {
    padding: 8px;
    width: 250px;

    background-color: white;
    border: 1px solid #336;
  }
`

type Properties = {
  comment: Comment
  focused: boolean
}

export const CommentBox = ({comment, focused}: Properties) =>
  <div className={styles('comment-box')} style={{transform: focused && `translateX(-20px)`}}>
    <p>{comment.text}</p>
  </div>
