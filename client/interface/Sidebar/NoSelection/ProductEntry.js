// external imports
import React from 'react'
import { graphql, createFragmentContainer } from 'react-relay'

const ProductEntry = ({ product }) => <div>{product.id}</div>

export default createFragmentContainer(
    ProductEntry,
    graphql`
        fragment ProductEntry_product on Product {
            id
        }
    `
)
