import * as React from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'
import {hashHistory, IndexRoute, Router, Route} from 'react-router'
import {Document} from './components/document'
import {Files} from './components/files'
import {store} from './lib/store'

const fill = {width: '100%', height: '100%'}

const App = ({children}) =>
    <Provider store={store}>
      <main style={fill}>{children}</main>
    </Provider>

export function routes() {
  return (
    <Route path='/' component={App}>
      <IndexRoute component={Files} />
      <Route path='/file/:slug' component={Document} />
    </Route>
  )
}

if (window.document) {
  render(<Router history={hashHistory}>{routes()}</Router>, document.getElementById('app'))
}
