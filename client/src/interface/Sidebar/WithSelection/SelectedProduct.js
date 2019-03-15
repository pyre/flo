// external imports
import React from 'react'
import { createFragmentContainer, graphql } from 'react-relay'
import { css } from 'glamor'
// local imports
import Header from './Header'

const SelectedProduct = ({ product }) => (
    <div {...css({
        display: 'flex',
        flexDirection: 'column',
    })}>
        <Header
            title={product.name}
            subtitle={product.description}
        />
    </div>
)

export default createFragmentContainer(
    SelectedProduct,
    graphql`
        fragment SelectedProduct_product on Product {
            progress
            attributes {
                value
                kind
            }
        }
    `
)
