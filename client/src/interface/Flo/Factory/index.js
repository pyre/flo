// external imports
import React from 'react'
import { createFragmentContainer, graphql } from 'react-relay'
// local imports
import { elementOutline, factoryPrimary } from '~/colors'

// the primary length for the central daimon
const diamondLength = 10
// the primary length for the squares that define the in and out point
const squareLength = 3

// the distance from the central diamond to the square
const armLength = 50

const Factory = ({
    factory: {
        position: { x, y },
        ...factory
    },
}) => (
    <>
        // there is a line going from one square to the other
        <line
            stroke={elementOutline}
            strokeWidth={1}
            x1={x + armLength}
            y1={y}
            y2={y}
            x2={x - armLength}
        />
        // the center of a factory is the diamond used as the target for clicks
        <polygon
            fill={factoryPrimary}
            stroke={elementOutline}
            strokeWidth={1}
            strokeLinejoin="round"
            points={`${x - diamondLength},${y} ${x},${y + diamondLength} ${x +
                diamondLength},${y} ${x},${y - diamondLength}`}
        />
        {/*
            the input and output node for a factory is represented by small boxes 50px outerHeight
        */}
        {/*only show the input rectangle if there is more than one product */}
        {(factory.inputs.length !== 1 ||
            // or there is only one product */
            (factory.inputs[0].product &&
                // and that product is on the same x coordinate
                factory.inputs[0].product.position.x === x)) && (
            <rect
                fill={factoryPrimary}
                stroke={elementOutline}
                strokeWidth={1}
                strokeLinejoin="round"
                x={x - armLength - squareLength}
                y={y - squareLength}
                width={2 * squareLength}
                height={2 * squareLength}
            />
        )}
        {/*only show the output rectangle if there is more than one result */}
        {(factory.outputs.length !== 1 ||
            // or there is only one product */
            (factory.outputs[0].product &&
                // and that product is on the same x coordinate
                factory.outputs[0].product.position.x === x)) && (
            <rect
                fill={factoryPrimary}
                stroke={elementOutline}
                strokeWidth={1}
                strokeLinejoin="round"
                x={x + armLength - squareLength}
                y={y - squareLength}
                width={2 * squareLength}
                height={2 * squareLength}
            />
        )}
    </>
)

export default createFragmentContainer(
    Factory,
    graphql`
        fragment Factory_factory on Factory {
            position {
                x
                y
            }
            inputs {
                product {
                    position {
                        x
                        y
                    }
                }
            }
            outputs {
                product {
                    position {
                        x
                        y
                    }
                }
            }
        }
    `
)
