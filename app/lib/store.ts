import {applyMiddleware, combineReducers, createStore} from 'redux'
import debounce from 'redux-debounced'
import thunk from 'redux-thunk'
import {reducers} from './reducers'

const reducer = combineReducers(reducers)

export const store = createStore(reducer, applyMiddleware(
  debounce,
  thunk
))

if (module.hot) {
  module.hot.accept('./reducers', (error) => {
    console.log('HMR ERROR', error)
    const {reducers} = require('./reducers')
    const nextReducer = combineReducers(reducers)
    store.replaceReducer(nextReducer)
  })
}
