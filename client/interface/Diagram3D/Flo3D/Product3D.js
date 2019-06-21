// external imports
import React, { useContext } from 'react'
import { createFragmentContainer, graphql } from 'react-relay'
import { useSphereElements } from '@react-vertex/geometry-hooks'
import { useHex } from '@react-vertex/color-hooks'
import { useBasicSolid } from '@react-vertex/material-hooks'
// local imports
import { Interface } from '~/context'

const Product3D = ({ product }) => {
    // get the current theme
    const {
        colors: { productColor },
    } = useContext(Interface)

    // compute the geometry for a sphere with the right radius
    const geometry = useSphereElements(0.5)

    return (
        <material program={useBasicSolid(useHex(productColor, true), 0.15)}>
            <geometry {...geometry} position={[product.position.x / 25, product.position.y / 25, 0]} />
        </material>
    )
}

export default createFragmentContainer(
    Product3D,
    graphql`
        fragment Product3D_product on Product {
            position {
                x
                y
            }
        }
    `
)
