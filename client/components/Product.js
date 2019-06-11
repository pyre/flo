// external imports
import React, { useRef } from 'react'
import { Spring } from 'react-spring/renderprops'
// local imports
import { productColor, productFillEmpty } from '~/design'
import { Arc } from '~/components'

export const Radius = 12

const Product = ({ progress = 1, x, y, style, ...unused }) => {
    // if we weren't given an x or y
    if (!x || !y) {
        x = Radius
        y = Radius
    }

    // the initial progress
    const initial = useRef(progress === 1 ? 360 : progress * 360)

    return (
        <svg
            style={{
                width: 2 * Radius,
                height: 2 * Radius,
                overflow: 'visible',
                zIndex: 100,
                ...style,
            }}
            x={x - Radius}
            y={y - Radius}
            {...unused}
        >
            // a full circle to designate the zero-progress state
            <circle fill={productFillEmpty} cx={Radius} cy={Radius} r={Radius} />
            // the primary fill of the product should designate progress
            <Spring from={{ value: initial.current }} to={{ value: progress * 360 }}>
                {({ value }) => <Arc fill={productColor} x={Radius} y={Radius} r={Radius} theta1={0} theta2={value} />}
            </Spring>
        </svg>
    )
}

export default Product
