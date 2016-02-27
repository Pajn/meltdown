import css from 'insert-css-module'
import * as React from 'react'

const styles = css`
  .panel {
    display: flex;
    height: 32px;
    background-color: #333;
  }

  .flex {
    flex: 1;
  }
`

type Properties = {
  children?: React.ReactElement<any> | Array<React.ReactElement<any>>
}

export const Panel = ({children}: Properties) =>
  <div className={styles('panel')}>
    {children}
  </div>

export const Whitespace = () => <div className={styles('flex')} />
