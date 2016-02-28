import css from 'insert-css-module'
import * as React from 'react'
import withState from 'recompose/withState'

const styles = css`
  .comment-box {
    padding: 8px;
    width: 250px;

    background-color: white;
    border: 1px solid #336;
  }

  .textarea textarea {
    margin-bottom: 8px;
    box-sizing: border-box;
    width: 100%;
    height: 80px;
    resize: none;
  }
`

type Properties = {
  cancelComment: () => void
  createComment: (text: string) => void
  initialValue?: string
}

type InnerProps = Properties & {
  value: string
  setValue: (value: string) => void
}

export const CreateCommentBox = withState<Properties>(
  'value', 'setValue', props => props.initialValue || '',
  ({cancelComment, createComment, value, setValue}: InnerProps) =>
    <div className={styles('comment-box')}>
      <div className={styles('textarea')}>
        <textarea value={value} onInput={e => setValue(e.target.value)} />
      </div>
      <button onClick={cancelComment}>
        Cancel
      </button>
      <button onClick={() => createComment(value)}>
        Save
      </button>
    </div>
)
