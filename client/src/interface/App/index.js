// external imports
import React, { useContext } from 'react'
import { App as AppContainer } from 'quark-web'
// local imports
import { DiagramProvider } from '~/state'
import { Diagram } from '~/interface'

const App = () => {
    return (
        <AppContainer>
            <Diagram />
        </AppContainer>
    )
}

export default () => (
    <DiagramProvider>
        <App />
    </DiagramProvider>
)
