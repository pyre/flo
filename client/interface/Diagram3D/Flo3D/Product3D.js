// external imports
import React from 'react'
import { createFragmentContainer, graphql } from 'react-relay'
import { useSphereElements } from "@react-vertex/geometry-hooks"
import { useHex } from '@react-vertex/color-hooks'
import { usePhongSolid } from '@react-vertex/material-hooks'

const Product3D = ({ product }) => {
    // compute the geometry for a sphere with the right radius
    const sphere = useSphereElements(0.5)

    // generate a material to apply to the sphere
    const diffuse = useHex('#29BDFA', true)
    const program = usePhongSolid(diffuse, 0.15)

    return (
        <material program={program}>
            <geometry {...sphere} position={[product.position.x / 50, product.position.y / 50, 0]} />
        </material>
    )
}

export default createFragmentContainer(Product3D, graphql`
    fragment Product3D_product on Product {
        position {
            x
            y
        }
    }
`)