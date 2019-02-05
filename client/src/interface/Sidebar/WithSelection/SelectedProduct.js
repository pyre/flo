// external imports
import React from 'react'
import { createFragmentContainer, graphql } from 'react-relay'
// local imports

const SelectedProduct = ({ product }) => <div>selected product</div>

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
