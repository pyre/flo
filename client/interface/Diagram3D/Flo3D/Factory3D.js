// external imports
import React, { useContext } from 'react'
import { createFragmentContainer, graphql } from 'react-relay'
import { useBoxElements } from '@react-vertex/geometry-hooks'
import { useHex } from '@react-vertex/color-hooks'
import { useBasicSolid } from '@react-vertex/material-hooks'
import { useVector3 } from '@react-vertex/math-hooks'
// local imports
import { Interface } from '~/context'

const Factory3D = ({ factory }) => {
    // get the current theme
    const {
        colors: { factoryPrimary },
    } = useContext(Interface)

    // we reprsent a factory as a diamond in 3d implemented as a rotated cube
    const element = useBoxElements(1, 1, 1)

    // the origin in local space
    const position = useVector3(factory.position.x / 25, factory.position.y / 25, 0)

    // we need to rotate the cube so that it looks like a diamond to the camera
    const rotation = useVector3(0, 0, Math.PI / 4)

    return (
        <material program={useBasicSolid(useHex(factoryPrimary, true), 0.15)}>
            <geometry {...element} rotation={rotation} position={position} />
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
