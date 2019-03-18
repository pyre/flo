// external imports
import React from 'react'
import { createFragmentContainer, graphql } from 'react-relay'
import { css } from 'glamor'
// local imports
import { Product, Label } from '~/components'
import Header from '../Header'

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
        {product.attributes.map(({ value, kind, name }) => (
            <React.Fragment key={name} >
                <Label>{name}</Label>
                <div {...css({
                    marginBottom: 10,
                })}>
                    {do {
                        if (kind === 'string') {
                        value
                    } else if (kind === 'date') {
                        value
                    } else {
                        value
                    }
                    }}
                </div>
            </React.Fragment>
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
