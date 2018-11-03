// external imports
import ReactDOM from 'react-dom'
import React, { useState, useContext } from 'react'
import { PrimaryButton } from 'quark-web'
// local imports
import { DiagramContext, DiagramProvider } from '~/state'

const HelloWorld = () => {
    const { diagram, zoomIn } = useContext(DiagramContext)

    return <PrimaryButton onClick={zoomIn}>{diagram.zoomLevel}</PrimaryButton>
}

ReactDOM.render(
    <DiagramProvider>
        <HelloWorld />
    </DiagramProvider>,
    document.getElementById('app')
)
