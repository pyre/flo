// externals 
import React, { useContext, useEffect } from 'react'
import { Canvas } from '@react-vertex/core'
import { useOrbitCamera, useOrbitControls } from '@react-vertex/orbit-camera'
import { useCanvasSize, useRender, usePointLight } from '@react-vertex/core'
import { convertHex } from '@react-vertex/color-hooks'
import { timer } from 'd3-timer'
// locals
import { useBrowserSize } from '~/hooks'
import { Interface, Diagram, EnvironmentProvider } from '~/context'
import { Query } from '~/components'
import Flo from './Flo3D'

// the query to fire
const query = graphql`
    query Diagram3DQuery($id: ID!) {
        node(id: $id) {
            ...Flo3D_producer
        }
    }
`

const Diagram3D = ({ node }) => {
    // get the canvas dimensions
    const { width, height } = useCanvasSize()

    // we want the camera to orbit the diagram
    const camera = useOrbitCamera(55, width / height, 1, 5000, c => {
        c.setPosition([0, 0, 30])
    })
    useOrbitControls(camera)

    const lightColor = convertHex('#fff')
    usePointLight(lightColor, [0, 10, 0])

    // render the scene continually
    const renderScene = useRender()
    useEffect(() => {
        const timerLoop = timer(() => {
            renderScene()
        })

        return () => timerLoop.stop()
    }, [renderScene])

    return (
        <camera view={camera.view} projection={camera.projection}>
            <Flo producer={node} />
        </camera>
    )
}

export default () => {
    const { dims, colors: { background } } = useContext(Interface)
    const { width, height } = useBrowserSize()
    const { diagram } = useContext(Diagram)

    return (

        <Canvas width={width - dims.sidebarWidth} height={height} clearColor={convertHex(background)} >
            <EnvironmentProvider >
                <Query query={query} variables={{ id: diagram.floID }} loadingState={null}>
                    {({ node }) =>
                        <Diagram3D node={node} />
                    }
                </Query>
            </EnvironmentProvider >
        </Canvas >
    )
}