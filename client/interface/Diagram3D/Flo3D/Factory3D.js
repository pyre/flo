// external imports
import React, { useContext } from 'react'
import { createFragmentContainer, graphql } from 'react-relay'
import { useSphereElements } from '@react-vertex/geometry-hooks'
import { useHex } from '@react-vertex/color-hooks'
import { useBasicSolid } from '@react-vertex/material-hooks'
// local imports
import { Interface } from '~/context'

const Factory3D = ({ factory }) => {
    // get the current theme
    const {
        colors: { factoryPrimary },
    } = useContext(Interface)

    // compute the geometry for a sphere with the right radius
    const sphere = useSphereElements(0.5)

    // in 3D, we represent a factory as a daimond centered at factory.position
    const points = []

    return (
        <material program={useBasicSolid(useHex(factoryPrimary, true), 0.15)}>
            {points.map(point => (
                <geometry {...sphere} position={[factory.position.x / 50, factory.position.y / 50, 0]} />
            ))}
        </material>
    )
}

export default createFragmentContainer(
    Factory3D,
    graphql`
        fragment Factory3D_factory on Factory {
            position {
                x
                y
            }
        }
    `
)
