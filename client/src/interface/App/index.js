// external imports
import React, { useContext } from 'react'
import { App as AppContainer, AlertContainer } from 'quark-web'
// local imports
import { DiagramProvider } from '~/state'
import { Diagram } from '~/interface'

const App = () => {
    return (
        <AppContainer>
            <AlertContainer
                style={{ position: 'fixed', top: 10, left: 10, right: 10, zIndex: 2 }}
            />
            <Diagram />
        </AppContainer>
    )
}

export default () => (
    <DiagramProvider>
        <App />
    </DiagramProvider>
)
