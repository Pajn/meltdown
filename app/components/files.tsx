import * as React from 'react'
import {ul} from 'react-hyperscript-helpers'
import {connect} from 'react-redux'
import {Link} from 'react-router'

type Properties = {
  files: Array<{
    name: string
    slug: string
  }>
}

export const Files = connect(
  state => ({files: state.files})
)(({files}: Properties) => ul(files.map(({name, slug}) =>
  <li key={name}>
    <Link to={`/file/${slug}`}>{name}</Link>
  </li>
)))
