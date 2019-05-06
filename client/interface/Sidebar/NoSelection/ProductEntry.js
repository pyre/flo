// external imports
import React from 'react'
import { graphql, createFragmentContainer } from 'react-relay'
import { css } from 'glamor'
// local imports
import { Product } from '~/components'

const ProductEntry = ({ product }) => (
    <div {...css({ display: 'flex', flexDirection: 'row', marginBottom: 10, alignItems: 'center' })}>
        <Product progress={1} {...css({ marginRight: 10 })} />
        <div {...css({})}>{product.name}</div>
    </div>
)

export default createFragmentContainer(
    ProductEntry,
    graphql`
        fragment ProductEntry_product on Product {
            name
        }
    `
)
