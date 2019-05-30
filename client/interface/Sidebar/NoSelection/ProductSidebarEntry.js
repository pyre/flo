// external imports
import React, { useContext } from 'react'
import { graphql, createFragmentContainer } from 'react-relay'
// local imports
import { Product } from '~/components'
import { Environment, Diagram } from '~/context'
import { mutate } from '~/utils'
import SidebarEntry from './SidebarEntry'

const ProductSidebarEntry = ({ product }) => {
    // grab the relay environment
    const environment = useContext(Environment)

    return (
        <SidebarEntry
            icon={<Product progress={product.progress} />}
            title={product.name}
            description={product.description}
            shadow={<Product progress={product.progress} />}
            onDrop={async position => {
                // add the product to the diagram and grab the id so we can select it
                const {
                    addProductToFlo: {
                        product: { id },
                    },
                } = await mutate({
                    environment,
                    query: graphql`
                        mutation ProductSidebarEntryAddProductMutation($input: AddProductInput!) {
                            addProductToFlo(input: $input) {
                                product {
                                    id
                                }
                            }
                        }
                    `,
                    variables: {
                        input: {
                            ...position,
                            flo: 'RmxvOjA=',
                            product: product.id,
                        },
                    },
                })

                // return the ids to select
                return [id]
            }}
        />
    )
}

export default createFragmentContainer(
    ProductSidebarEntry,
    graphql`
        fragment ProductSidebarEntry_product on Product {
            id
            name
            description
            progress
        }
    `
)
