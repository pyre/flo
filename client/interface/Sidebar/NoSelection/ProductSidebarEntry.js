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
    // and diagram singleton
    const { selectElements } = useContext(Diagram)

    return (
        <SidebarEntry
            icon={<Product progress={1} />}
            title={product.name}
            description={product.description}
            shadow={position => (
                <Product
                    progress={1}
                    style={{
                        position: 'fixed',
                        top: position.y,
                        left: position.x,
                        transform: 'translateX(-50%) translateY(-50%)',
                    }}
                />
            )}
            onDrop={position =>
                mutate({
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
                            product: '1',
                        },
                    },
                }).then(({ addProductToFlo: { product: { id } } }) => {
                    // select the product we just added
                    selectElements(id)
                })
            }
        />
    )
}

export default createFragmentContainer(
    ProductSidebarEntry,
    graphql`
        fragment ProductSidebarEntry_product on Product {
            name
            description
        }
    `
)
