// external import
import React from 'react'
// local imports
import {
    factoryPrimary,
} from '~/design'

const FactoryDiamond = ({diamondLength=12, x, y, style, center, ...unused }) => {
    // the locations for the 4 points of the rectangle
    const leftPoint = {
        x: 0,
        y: diamondLength,
    }
    const topPoint = {
        x: diamondLength,
        y: 0,
    }
    const rightPoint = {
        x: 2 * diamondLength,
        y: diamondLength,
    }
    const bottomPoint = {
        y: 2 *  diamondLength,
        x: diamondLength,
    }

    // if we are centering on a specific point
    if (center) {
        x -= diamondLength
        y -= diamondLength
    } 

    return (
        <svg
            style={{
                width: 2 * diamondLength,
                height: 2 * diamondLength,
                ...style,
            }}
            x={x}
            y={y}
            {...unused}
        >
            <polygon
                fill={factoryPrimary}
                stroke={'none'}
                strokeWidth={1}
                points={`${leftPoint.x},${leftPoint.y} ${topPoint.x},${topPoint.y} ${rightPoint.x},${rightPoint.y} ${
                    bottomPoint.x
                },${bottomPoint.y}`}
            />
        </svg>
    )
}

export default FactoryDiamond