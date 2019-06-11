// external imports
import React from 'react'
import { createFragmentContainer, graphql } from 'react-relay'
// local imports
import Product from './Product3D'

const Flo = ({ producer }) => (
    <>
        {producer.products.map(product => (
            <Product key={product.id} product={product} />
        ))}
    </>
)

export default createFragmentContainer(
    Flo,
    graphql`
        fragment Flo3D_producer on Producer {
            ... on Node {
                id
            }

            products {
                id
                ...Product3D_product
            }
        }
    `
)
