import * as React from 'react'
import {connect} from 'react-redux'
import {Directory as File} from '../lib/entities'
import {getFile} from '../lib/file-tools'
import {Directory} from './directory'
import {Document} from './document'

type Properties = {
  path: string[]
  file?: File
}

export const FileOrDirectory = connect(
  ({files}, {params}) => {
    let path = []
    if (params.path) {
      path.push(params.path)
      console.log(params.splat)
    }
    if (params.splat) {
      const parts = params.splat.split('/')
      for (const part of parts) {
        if (part) {
          path.push(part)
        }
      }
    }
    return {file: (path && getFile(files, path)) || files}
  }
)(({file}: Properties) => file.files
  ? <Directory directory={file} />
  : <Document file={file} />
)
