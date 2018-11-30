// external imports
import React from 'react'

// a function to compute cartesian coordinates from polar coordinates
function polarToCartesian({ x, y, r, angle }) {
    // transform the cartesian coordinates to polar
    const rad = (angle * Math.PI) / 180.0

    // return the cartesian coordinates
    return {
        x: x + r * Math.cos(rad),
        y: y + r * Math.sin(rad),
    }
}

function computeArc({ x, y, r, theta1, theta2 }) {
    // compute the bounds of the arc
    const start = polarToCartesian({ x, y, r, angle: theta2 })
    const end = polarToCartesian({ x, y, r, angle: theta1 })

    // check if we need to go the "other way"
    const largeArcFlag = theta2 > theta1 <= 180 ? '1' : '0'

    // build the path
    return ['M', start.x, start.y, 'A', r, r, 0, largeArcFlag, 0, end.x, end.y].join(' ')
}

export default ({ x, y, r, theta1, theta2, ...props }) => (
    <path fill="none" d={computeArc({ x, y, r, theta1, theta2 })} {...props} />
)
