// external imports
import React from 'react'
import ReactDOM from 'react-dom'
import '@babel/polyfill'
import { App as AppContainer, AlertContainer } from 'quark-web'
// local imports
import { DiagramProvider } from '~/state'
import { Diagram, Sidebar } from '~/interface'

const App = () => {
    return (
        <AppContainer direction="row">
            <AlertContainer style={{ position: 'fixed', top: 10, left: 10, right: 10, zIndex: 2 }} />
            <Diagram />
            <Sidebar />
        </AppContainer>
    )
}

ReactDOM.render(
    <DiagramProvider>
        <App />
    </DiagramProvider>,
    document.getElementById('app')
)
