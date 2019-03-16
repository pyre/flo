// external imports
import React from 'react'
import { createFragmentContainer, graphql } from 'react-relay'
import { css } from 'glamor'
// local imports
import { Product } from '~/components'
import Header from './Header'

const SelectedProduct = ({ product }) => (
    <div {...css({
        display: 'flex',
        flexDirection: 'column',
    })}>
        <Header
            icon={<Product progress={product.progress} />}
            title={product.name}
            subtitle={product.description}
        />
    </div>
)

export default createFragmentContainer(
    SelectedProduct,
    graphql`
        fragment SelectedProduct_product on Product {
            name
            progress
            attributes {
                value
                kind
            }
        }
    `
)
