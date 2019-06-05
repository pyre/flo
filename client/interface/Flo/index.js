// external imports
import React from 'react'
import { createFragmentContainer, graphql } from 'react-relay'
// local imports
import Factory from './Factory'
import Product from './Product'
import Lines from './Lines'

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
        fragment Flo_producer on Producer {
            ... on Node {
                id
            }

            products {
                id
                ...Product_product
            }
            factories {
                id
                ...Factory_factory
            }
            ...Lines_flo
        }
    `
)
