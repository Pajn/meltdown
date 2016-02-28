import * as React from 'react'
import {ul} from 'react-hyperscript-helpers'
import {Link} from 'react-router'
import {Directory as DirectoryEntity} from '../lib/entities'
import {getUrl} from '../lib/file-tools'

type Properties = {
  directory: DirectoryEntity
}

export const Directory = ({directory: {name, path, files}}: Properties) =>
  <div>
    <h1>{name}</h1>
    {path && <Link to={getUrl(path)}>Go up</Link>}
    {ul(Object.values(files).map(({name, slug, path}) =>
      <li key={name}>
        <Link to={getUrl([...path, slug])}>{name}</Link>
      </li>
    ))}
  </div>
