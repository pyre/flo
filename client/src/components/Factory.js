// external import
import React from 'react'
import { css } from 'glamor'
// local imports
import { factoryPrimary, factorySelectedBorder, selectedBorderGap, selectedBorderWidth, background } from '~/design'

const Factory = ({ diamondLength = 12, x, y, style, center, selected, ...unused }) => {
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
        y: 2 * diamondLength,
        x: diamondLength,
    }

    // if we are centering on a specific point
    if (center) {
        x -= diamondLength
        y -= diamondLength
    }

    return (
        <svg
            {...css({
                width: 2 * diamondLength,
                height: 2 * diamondLength,
                overflow: 'visible',
                ...style,
            })}
            x={x}
            y={y}
            {...unused}
        >
            // if the factory is selected
            {selected && (
                <>
                    // the outer highlight for selected factory indicator
                    <polygon
                        fill={factorySelectedBorder}
                        stroke={'none'}
                        strokeWidth={1}
                        points={`
                            ${leftPoint.x - selectedBorderGap - selectedBorderWidth},${leftPoint.y}
                            ${topPoint.x},${topPoint.y - selectedBorderGap - selectedBorderWidth}
                            ${rightPoint.x + selectedBorderGap + selectedBorderWidth}, ${rightPoint.y}
                            ${bottomPoint.x},${bottomPoint.y + selectedBorderGap + selectedBorderWidth}
                        `}
                    />
                    <polygon
                        fill={background}
                        stroke={'none'}
                        strokeWidth={1}
                        points={`
                            ${leftPoint.x - selectedBorderGap},${leftPoint.y}
                            ${topPoint.x},${topPoint.y - selectedBorderGap}
                            ${rightPoint.x + selectedBorderGap}, ${rightPoint.y}
                            ${bottomPoint.x},${bottomPoint.y + selectedBorderGap}
                        `}
                    />
                </>
            )}
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

export default Factory
