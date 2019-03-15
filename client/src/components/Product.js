// external imports
import React from 'react'
// local imports
import { productColor, productFillEmpty } from '~/design'
import { Arc } from '~/components'

export const Radius = 12

const Product = ({ progress, x, y }) => (
    <svg>
        // a full circle to designate the zero-progress state
        <circle fill={productFillEmpty} cx={x} cy={y} r={Radius} />
        // the primary fill of the product should designate progress
        <Arc
            fill={productColor}
            x={x}
            y={y}
            r={Radius}
            theta1={0}
            theta2={360 * progress}
        />
    </svg>
)

export default Product