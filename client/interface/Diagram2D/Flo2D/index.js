// external imports
import React from 'react'
import { createFragmentContainer, graphql } from 'react-relay'
// local imports
import Factory from './Factory2D'
import Product from './Product2D'
import Lines from './Lines2D'

const Flo = ({ producer, ...unused }) => {
    // clear up unused props
    Reflect.deleteProperty(unused, 'relay')

    return (
        <>
            // the lines have to go above so they render underneath
            <Lines flo={producer} />
            // render the products and factories
            {producer.factories.map(factory => (
                <Factory key={factory.id} factory={factory} />
            ))}
            {producer.products.map(product => (
                <Product key={product.id} product={product} />
            ))}
        </>
    )
}

export default createFragmentContainer(
    Flo,
    graphql`
        fragment Flo2D_producer on Producer {
            ... on Node {
                id
            }

            products {
                id
                ...Product2D_product
            }

            factories {
                id
                ...Factory2D_factory
            }
            ...Lines2D_flo
        }
    `
)
