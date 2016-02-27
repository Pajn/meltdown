import {createReducer} from 'redux-decorated'
import {togglePreview} from '../../actions/document'

export const editorSettings = createReducer({showPreview: true})
  .when(togglePreview, (state: {showPreview: boolean}, _) =>
      Object.assign({}, state, {showPreview: !(state.showPreview)}))
