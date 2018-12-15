// external imports
import React, { useContext } from 'react'
import { App as AppContainer, AlertContainer } from 'quark-web'
// local imports
import { DiagramProvider } from '~/state'
import { Diagram, Sidebar } from '~/interface'

const App = () => {
    return (
        <AppContainer direction="row">
            <AlertContainer
                style={{ position: 'fixed', top: 10, left: 10, right: 10, zIndex: 2 }}
            />
            <Diagram />
            <Sidebar />
        </AppContainer>
    )
}

export default () => (
    <DiagramProvider>
        <App />
    </DiagramProvider>
)
