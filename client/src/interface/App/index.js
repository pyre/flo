// external imports
import React, { useContext } from 'react'
import { PrimaryButton, App as AppContainer } from 'quark-web'
// local imports
import { DiagramProvider, DiagramContext } from '~/state'

const App = () => {
    const { diagram, zoomIn } = useContext(DiagramContext)

    return (
        <AppContainer>
            <PrimaryButton onClick={zoomIn}>{diagram.zoomLevel}</PrimaryButton>
        </AppContainer>
    )
}

export default () => (
    <DiagramProvider>
        <App />
    </DiagramProvider>
)
