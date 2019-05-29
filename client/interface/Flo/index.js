// external imports
import React from 'react'
import { createFragmentContainer, graphql } from 'react-relay'
// local imports
import { useSubscription } from '~/hooks'
import Factory from './Factory'
import Product from './Product'
import Lines from './Lines'

const Flo = ({ producer }) => {
    // we need to update when new products are added to this flo
    useSubscription(
        graphql`
            subscription FloSubscription($flo: ID!) {
                newProduct(flo: $flo) {
                    id
                    ...Product_product
                }
            }
        `,
        { flo: producer.id },
        {
            updater(store, data) {
                // find the right flo
                const floRecord = store.get(producer.id)

                // grab a reference to the connection
                const connection = floRecord.getLinkedRecords('products')

                // grab the information we just asked for the new product
                const newProduct = store.get(data.newProduct.id)

                // add the new product to the list of products in the flo
                floRecord.setLinkedRecords([...connection, newProduct], 'products')
            },
        }
    )
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
