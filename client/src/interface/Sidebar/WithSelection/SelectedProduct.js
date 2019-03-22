// external imports
import React from 'react'
import { createFragmentContainer, graphql } from 'react-relay'
import { css } from 'glamor'
import { Label } from 'quark-web'
// local imports
import { Product } from '~/components'
import Header from '../Header'

const SelectedProduct = ({ product }) => (
    <div
        {...css({
            display: 'flex',
            flexDirection: 'column',
        })}
    >
        <Header icon={<Product progress={product.progress} />} title={product.name} subtitle={product.description} />
        {product.attributes.map(({ value, kind, name }) => (
            <Label key={name} value={name} style={{ marginBottom: 10 }}>
                <span>
                    {do {
                        if (kind === 'string') {
                            value
                        } else if (kind === 'date') {
                            value
                        } else {
                            value
                        }
                    }}
                </span>
            </Label>
        ))}
    </div>
)

export default createFragmentContainer(
    SelectedProduct,
    graphql`
        fragment SelectedProduct_product on Product {
            name
            progress
            attributes {
                name
                value
                kind
            }
        }
    `
)
