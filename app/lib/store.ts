import {combineReducers, createStore} from 'redux'
import {editorSettings} from './reducers/editor-settings'

const reducer = combineReducers({editorSettings})

export const store = createStore(reducer)
