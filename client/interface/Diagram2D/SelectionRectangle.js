// external imports
import React from 'react'
import { useRelativePosition } from '~/hooks'

export default ({ point1, point2 }) => {
    // compute the relative locations for the points
    const relativePoint1 = useRelativePosition(point1)
    const relativePoint2 = useRelativePosition(point2)

    // compute the dimensions of the rectangle
    const width = Math.abs(relativePoint2.x - relativePoint1.x)
    const height = Math.abs(relativePoint2.y - relativePoint1.y)

    // figure out the transform to align the rectangle with the user's mouse
    const transform = [1, 0, 0, 1, 0, 0]

    // if the origin is to the right of the mouse
    if (relativePoint1.x > relativePoint2.x) {
        // we need to move the rectangle to the left by its width
        transform[4] = -width
    }

    // if the origin is above the rectangle
    if (relativePoint1.y > relativePoint2.y) {
        // we need to translate the rectangle down by its height
        transform[5] = -height
    }

    return (
        <rect
            x={relativePoint1.x}
            y={relativePoint1.y}
            width={width}
            height={height}
            transform={`matrix(${transform.join(',')})`}
            style={{
                fill: 'transparent',
                stroke: 'black',
                strokeWidth: 1,
                strokeDasharray: 10,
            }}
        />
    )
}
