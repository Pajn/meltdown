import {combineReducers, createStore} from 'redux'
import {editorSettings} from './reducers/editor-settings'
import {files} from './reducers/files'

const reducer = combineReducers({editorSettings, files})

export const store = createStore(reducer)
