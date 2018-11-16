// external imports
import React from 'react'
import { useRelativePosition } from '~/hooks'

export default ({ point1, point2 }) => {
    // compute the relative locations for the points
    const p1 = useRelativePosition(point1)

    // compute the dimensions of the rectangle
    const width = Math.abs(point2.x - point1.x)
    const height = Math.abs(point2.y - point1.y)

    // figure out the transform to align the rectangle with the user's mouse
    const transform = [1, 0, 0, 1, 0, 0]

    // if the origin is to the right of the mouse
    if (point1.x > point2.x) {
        // we need to move the rectangle to the left by its width
        transform[4] = -width
    }

    // if the origin is above the rectangle
    if (point1.y > point2.y) {
        // we need to translate the rectangle down by its height
        transform[5] = -height
    }

    return (
        <rect
            x={p1.x}
            y={p1.y}
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
