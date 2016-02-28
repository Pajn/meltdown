import * as React from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'
import {hashHistory, IndexRoute, Router, Route} from 'react-router'
import {FileOrDirectory} from './components/file'
import {store} from './lib/store'

const fill = {width: '100%', height: '100%'}

const App = ({children}) =>
    <Provider store={store}>
      <main style={fill}>{children}</main>
    </Provider>

export function routes() {
  return (
    <Route path='/' component={App}>
      <IndexRoute component={FileOrDirectory} />
      <Route path='/file/:path*' component={FileOrDirectory} />
    </Route>
  )
}

if (window.document) {
  render(<Router history={hashHistory}>{routes()}</Router>, document.getElementById('app'))
}
