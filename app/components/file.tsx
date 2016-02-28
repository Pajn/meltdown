import * as React from 'react'
import {connect} from 'react-redux'
import {Directory as File} from '../lib/entities'
import {getFile} from '../lib/file-tools'
import {Directory} from './directory'
import {Document} from './document'

function getPath(routeParams) {
  let path = []
  if (routeParams.path) {
    path.push(routeParams.path)
  }
  if (routeParams.splat) {
    const parts = routeParams.splat.split('/')
    for (const part of parts) {
      if (part) {
        path.push(part)
      }
    }
  }
  return path
}

type Properties = {
  path: string[]
  file?: File
}

export const FileOrDirectory = connect(
  ({files}, {params}) => {
    const path = getPath(params)
    return {file: getFile(files, path) || files}
  }
)(({file}: Properties) => file.files
  ? <Directory directory={file} />
  : <Document file={file} />
)
