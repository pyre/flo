// external imports
import React from 'react'
import { graphql, createFragmentContainer } from 'react-relay'
// local imports
import { Arc } from '~/components'
import { productColor, background, elementOutline } from '~/colors'

// the radius of the inner circle
const innerRadius = 10
const gutter = 15

const Product = ({ product }) => (
    <>
        {do {
            console.log(product)
            // render a full circle if there are both a source and at least one binding // if there is
            if (product.source && product.bindings.length > 0) {
                ;<circle
                    fill={elementOutline}
                    cx={product.position.x}
                    cy={product.position.y}
                    r={gutter + 1}
                />
            }
            // if there is no source, then there is only bindings
            else if (product.source) {
                // so render the arc tha leaves the gap on the right
                ;<Arc
                    r={gutter + 1}
                    x={product.position.x}
                    y={product.position.y}
                    theta1={45}
                    theta2={315}
                    stroke={elementOutline}
                />
            }
            // there are only bindings
            else {
                // so render the arc tha leaves the gap on the left
                ;<Arc
                    r={gutter + 1}
                    x={product.position.x}
                    y={product.position.y}
                    theta1={215}
                    theta2={165}
                    stroke={elementOutline}
                />
            }
        }}
        <circle fill={background} cx={product.position.x} cy={product.position.y} r={gutter} />
        <circle
            fill={productColor}
            cx={product.position.x}
            cy={product.position.y}
            r={innerRadius}
        />
    </>
)

export default createFragmentContainer(
    Product,
    graphql`
        fragment Product_product on Product {
            position {
                x
                y
            }
            source {
                id
            }
            bindings {
                id
            }
        }
    `
)
