// external imports
import React from 'react'
import { createFragmentContainer, graphql } from 'react-relay'
// local imports
import Factory from './Factory'
import Product from './Product'
import Lines from './Lines'

const Flo = ({ flo }) => (
    <>
        // the lines have to go above so they render underneath
        <Lines flo={flo} />
        // render the products and factories
        {flo.factories.map(factory => (
            <Factory key={factory.id} factory={factory} />
        ))}
        {flo.products.map(product => (
            <Product key={product.id} product={product} />
        ))}
    </>
)

export default createFragmentContainer(
    Flo,
    graphql`
        fragment Flo_flo on Flo {
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
