// externals
import React, { useContext, useEffect } from 'react'
import { Canvas } from '@react-vertex/core'
import { useCanvasSize, useRender } from '@react-vertex/core'
import { useInvertedMatrix, usePerspectiveMatrix } from '@react-vertex/math-hooks'
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
            ... on Producer {
                products {
                    position {
                        x
                        y
                    }
                }
            }
        }
    }
`

const Diagram3D = ({ node }) => {
    // get the canvas dimensions
    const canvas = useCanvasSize()

    // render the scene continually
    const renderScene = useRender()
    useEffect(() => {
        const renderLoop = timer(renderScene)

        return () => renderLoop.stop
    }, [renderScene])

    // compute the center of the scene
    const centerX = node.products.reduce((prev, { position }) => prev + position.x, 0) / node.products.length
    const centerY = node.products.reduce((prev, { position }) => prev + position.y, 0) / node.products.length

    // place the camera a fixex distance away from the center
    const view = useInvertedMatrix(centerX / 50, centerY / 50, 30)
    const projection = usePerspectiveMatrix(75, canvas.width / canvas.height)

    return (
        <camera view={view} projection={projection}>
            <Flo producer={node} />
        </camera>
    )
}

export default () => {
    const {
        dims,
        colors: { background },
    } = useContext(Interface)
    const { width, height } = useBrowserSize()
    const { diagram } = useContext(Diagram)

    return (
        <Canvas width={width - dims.sidebarWidth} height={height} clearColor={convertHex(background)}>
            <EnvironmentProvider>
                <Query query={query} variables={{ id: diagram.floID }} loadingState={null}>
                    {({ node }) => <Diagram3D node={node} />}
                </Query>
            </EnvironmentProvider>
        </Canvas>
    )
}
