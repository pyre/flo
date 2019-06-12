// external imports
import React from 'react'
import { createFragmentContainer, graphql } from 'react-relay'
// local imports
import Product from './Product3D'
import Factory from './Factory3D'

const Flo = ({ producer }) => (
    <>
        {producer.products.map(product => (
            <Product key={product.id} product={product} />
        ))}
        {producer.factories.map(factory => (
            <Factory key={factory.id} factory={factory} />
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
            factories {
                id
                ...Factory3D_factory
            }
        }
    `
)
