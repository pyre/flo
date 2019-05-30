// external imports
import React from 'react'
import { createFragmentContainer, graphql } from 'react-relay'
// local imports
import { connectorColor } from '~/design'

// the primary length for the squares that define the in and out point
const squareLength = 3
// the distance from the central diamond to the square
const armLength = 50

const Lines = ({ flo }) => (
    <g>
        {flo.factories.map(factory => {
            // compute the location for the left and right input squares
            const leftSquareLocation = {
                x: factory.position.x - armLength,
                y: factory.position.y,
            }
            const rightSquareLocation = {
                x: factory.position.x + armLength,
                y: factory.position.y,
            }

            return (
                <React.Fragment key={factory.id}>
                    // only show the input rectangle if there is more than one product
                    {factory.inputs.length !== 1 && (
                        <rect
                            fill={connectorColor}
                            x={leftSquareLocation.x - squareLength}
                            y={leftSquareLocation.y - squareLength}
                            width={2 * squareLength}
                            height={2 * squareLength}
                        />
                    )}
                    // only show the output rectangle if there is more than one result
                    {factory.outputs.length !== 1 && (
                        <rect
                            fill={connectorColor}
                            x={rightSquareLocation.x - squareLength}
                            y={rightSquareLocation.y - squareLength}
                            width={2 * squareLength}
                            height={2 * squareLength}
                        />
                    )}
                    // there is a line going from one square to the other
                    <line
                        stroke={connectorColor}
                        strokeWidth={1}
                        x1={factory.position.x + armLength}
                        y1={factory.position.y}
                        y2={factory.position.y}
                        x2={factory.position.x - armLength}
                    />
                    // render the lines joining the left square to each of the inputs
                    {factory.inputs
                        .filter(({ product }) => product)
                        .map(binding => (
                            <React.Fragment key={binding.id}>
                                <line
                                    x1={leftSquareLocation.x}
                                    y1={leftSquareLocation.y}
                                    x2={leftSquareLocation.x}
                                    y2={binding.product.position.y}
                                    stroke={connectorColor}
                                    strokeWidth={1}
                                />
                                <line
                                    x1={leftSquareLocation.x}
                                    y1={binding.product.position.y}
                                    x2={binding.product.position.x}
                                    y2={binding.product.position.y}
                                    stroke={connectorColor}
                                    strokeWidth={1}
                                />
                            </React.Fragment>
                        ))}
                    // render the lines joining the right square to each of its results
                    {factory.outputs.map(result => (
                        <React.Fragment key={result.id}>
                            <line
                                x1={rightSquareLocation.x}
                                y1={rightSquareLocation.y}
                                x2={rightSquareLocation.x}
                                y2={result.product.position.y}
                                stroke={connectorColor}
                                strokeWidth={1}
                            />
                            <line
                                x1={rightSquareLocation.x}
                                y1={result.product.position.y}
                                x2={result.product.position.x}
                                y2={result.product.position.y}
                                stroke={connectorColor}
                                strokeWidth={1}
                            />
                        </React.Fragment>
                    ))}
                </React.Fragment>
            )
        })}
    </g>
)

export default createFragmentContainer(
    Lines,
    graphql`
        fragment Lines_flo on Producer {
            factories {
                id
                position {
                    x
                    y
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
            }
        }
    `
)
