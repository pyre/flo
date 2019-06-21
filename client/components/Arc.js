// external imports
import React from 'react'
// local imports
import { useBrowserSize } from '~/hooks'

// a function to compute cartesian coordinates from polar coordinates
function polarToCartesian({ origin: { x, y }, r, angle }) {
    // transform the cartesian coordinates to polar
    const rad = ((angle - 90) * Math.PI) / 180.0

    // return the cartesian coordinates
    return {
        x: x + r * Math.cos(rad),
        y: y + r * Math.sin(rad),
    }
}

export default ({ x, y, r, theta1, theta2, fill = 'none', ...props }) => do {
    const { height } = useBrowserSize()

    // if we are supposed to draw a circle
    if (theta2 === 360) {
        // do that instead
        ;<circle cx={x} cy={y} r={r} fill={fill} {...props} />
    } else {
        // compute the bounds of the arc
        const start = polarToCartesian({ origin: { x, y }, r, angle: theta2 })
        const end = polarToCartesian({ origin: { x, y }, r, angle: theta1 })

        // check if we need to go the "other way"
        const largeArcFlag = theta2 - theta1 <= 180 ? '0' : '1'

        // build the path with at least the arc
        const path = ['M', start.x, start.y, 'A', r, r, 0, largeArcFlag, 0, end.x, end.y]

        // if we are going to fill the arc then we should add 2 lines that cut it like a pie
        if (fill !== 'none') {
            path.push('L', x, y, 'Z')
        }

        ;<path d={path.join(' ')} fill={fill} {...props} />
    }
}
