import * as React from 'react'
import {render} from 'react-dom'
import {App} from './app'

function renderApp(App) {
  const app = document.getElementById('app')
  if (module.hot) {
    const RedBox = require('redbox-react')
    try {
      render(<App />, app)
    } catch (error) {
      render(<RedBox error={error} />, app)
    }
  } else {
    render(<App />, app)
  }
}

if (window.document) {
  console.log(App)
  renderApp(App)
}

if (module.hot) {
  module.hot.accept('./app', () => {
    const UpdatedApp = require('./app').App
    setTimeout(() => renderApp(UpdatedApp))
  })
}
