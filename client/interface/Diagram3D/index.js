// externals 
import React, { useContext } from 'react'
import { Canvas } from '@react-vertex/core'
import { useOrbitCamera, useOrbitControls } from '@react-vertex/orbit-camera'
import { useCanvasSize, useRender, usePointLight } from '@react-vertex/core'
// locals
import { useBrowserSize } from '~/hooks'
import { Interface } from '~/context'

const Diagram3D = () => {
    // get the canvas dimensions
    const { width, height } = useCanvasSize()

    // we want the camera to orbit the diagram
    const camera = useOrbitCamera(55, width / height, 1, 5000, c => {
        c.setPosition([0, 0, 30])
    })

    return (
        <camera view={camera.view} projection={camera.projection}>
        </camera>
    )
}

export default () => {
    const { dims } = useContext(Interface)
    const { width, height } = useBrowserSize()

    return (
        <Canvas width={width - dims.sidebarWidth} height={height} >
            <Diagram3D />
        </Canvas >
    )
}