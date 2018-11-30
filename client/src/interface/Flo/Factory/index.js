// external imports
import React from 'react'
import { createFragmentContainer, graphql } from 'react-relay'
// local imports
import { elementOutline, factoryPrimary } from '~/colors'

/*
    Every factory component is responsible for rendering the following visual entities:
    - The diamond at the center
        - when clicked, focuses the inspector on that element
        - when hovered, shows a tooltip with descriptive information on the factory
        - the optional input and output squares (with a line joining them)
        - render the lines linking the input square with to the inputs themselves
        - render the lines linking the output square to the outputs themselves
*/

// the primary length for the central daimond
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
}) => {
    // the location of the left square
    const leftSquareLocation = {
        x: x - armLength,
        y: y,
    }
    // the location of the right square
    const rightSquareLocation = {
        x: x + armLength,
        y: y,
    }

    return (
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
            // render the lines joining the left square to each of the inputs
            {factory.inputs.map((binding, i) => (
                <React.Fragment key={binding.id}>
                    <line
                        id={binding.id}
                        x1={leftSquareLocation.x}
                        y1={leftSquareLocation.y}
                        x2={leftSquareLocation.x}
                        y2={binding.product.position.y}
                        stroke={elementOutline}
                        strokeWidth={1}
                    />
                    <line
                        id={binding.id}
                        x1={leftSquareLocation.x}
                        y1={binding.product.position.y}
                        x2={binding.product.position.x}
                        y2={binding.product.position.y}
                        stroke={elementOutline}
                        strokeWidth={1}
                    />
                </React.Fragment>
            ))}
            // render the lines joining the right square to each of its results
            {factory.outputs.map(result => (
                <React.Fragment key={result.id}>
                    <line
                        id={result.id}
                        x1={rightSquareLocation.x}
                        y1={rightSquareLocation.y}
                        x2={rightSquareLocation.x}
                        y2={result.product.position.y}
                        stroke={elementOutline}
                        strokeWidth={1}
                    />
                    <line
                        id={result.id}
                        x1={rightSquareLocation.x}
                        y1={result.product.position.y}
                        x2={result.product.position.x}
                        y2={result.product.position.y}
                        stroke={elementOutline}
                        strokeWidth={1}
                    />
                </React.Fragment>
            ))}
            // the center of a factory is the diamond used as the target for clicks
            <polygon
                fill={factoryPrimary}
                stroke={elementOutline}
                strokeWidth={1}
                strokeLinejoin="round"
                points={`${x - diamondLength},${y} ${x},${y + diamondLength} ${x +
                    diamondLength},${y} ${x},${y - diamondLength}`}
            />
            // only show the input rectangle if there is more than one product
            {(factory.inputs.length !== 1 ||
                // or there is only one product */
                (factory.inputs[0].product &&
                    // and that product is on the same x coordinate
                    factory.inputs[0].product.position.y !== y)) && (
                <rect
                    fill={factoryPrimary}
                    stroke={elementOutline}
                    strokeWidth={1}
                    strokeLinejoin="round"
                    x={leftSquareLocation.x - squareLength}
                    y={leftSquareLocation.y - squareLength}
                    width={2 * squareLength}
                    height={2 * squareLength}
                />
            )}
            // only show the output rectangle if there is more than one result
            {(factory.outputs.length !== 1 ||
                // or there is only one product
                (factory.outputs[0].product &&
                    // and that product is on the same x coordinate
                    factory.outputs[0].product.position.y !== y)) && (
                <rect
                    fill={factoryPrimary}
                    stroke={elementOutline}
                    strokeWidth={1}
                    strokeLinejoin="round"
                    x={rightSquareLocation.x - squareLength}
                    y={rightSquareLocation.y - squareLength}
                    width={2 * squareLength}
                    height={2 * squareLength}
                />
            )}
        </>
    )
}

export default createFragmentContainer(
    Factory,
    graphql`
        fragment Factory_factory on Factory {
            position {
                x
                y
            }
            inputs {
                id
                product {
                    id
                    position {
                        x
                        y
                    }
                }
            }
            outputs {
                id
                product {
                    id
                    position {
                        x
                        y
                    }
                }
            }
        }
    `
)
