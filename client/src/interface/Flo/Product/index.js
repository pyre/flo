// external imports
import React from 'react'
import { graphql, createFragmentContainer } from 'react-relay'
// local imports
import { productColor, background } from '~/colors'

const Product = ({ product }) => (
    <>
        <circle fill={background} cx={product.position.x} cy={product.position.y} r={20} />
        <circle fill={productColor} cx={product.position.x} cy={product.position.y} r={10} />
    </>
)

export default createFragmentContainer(
    Product,
    graphql`
        fragment Product_product on Product {
            position {
                x
                y
            }
        }
    `
)
