import {createReducer, updateIn} from 'redux-decorated'
import {createDirectory, createFile} from '../../actions/files'
import {Directory} from '../entities'

const propPath = (path: string[]) =>
  path.reduce((path, slug) => [...path, 'files', slug], [])

export const files = createReducer<Directory>({name: '', slug: '', path: undefined, files: {
  test: {name: 'Test', slug: 'test', path: []},
  sub: {name: 'Sub', slug: 'sub', path: [], files: {
    test: {name: 'Test', slug: 'test', path: ['sub']},
  }},
}})
  .when(createFile, (file) => updateIn(propPath(file.path), file))
  .when(createDirectory, (file) => updateIn(propPath(file.path), Object.assign({files: {}, file})))
