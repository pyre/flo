// external imports
import React, { useContext } from 'react'
import { createFragmentContainer, graphql } from 'react-relay'
// local imports
import { center } from '~/utils'
import { Arc } from '~/components'
import { Interface } from '~/context'

// the primary length for the squares that define the in and out point
const squareLength = 3
// the distance from the central diamond to the square
const armLength = 50
// the radius of the inner circle that prevents the grid leaking under a product
const productGutter = 15

const Lines = ({ flo }) => {
    const {
        colors: { connectorColor, background },
    } = useContext(Interface)

    return (
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

                // compute the locations for inputs which may not have products
                const inputLocations = center(
                    {
                        x: leftSquareLocation.x - 2 * armLength,
                        y: leftSquareLocation.y,
                    },
                    factory.inputs.length
                )

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
                        {factory.inputs.map((binding, i) => {
                            // the location for the input can be overwritten by the product
                            const location = binding.product ? binding.product.position : inputLocations[i]

                            return (
                                <React.Fragment key={binding.id}>
                                    <line
                                        x1={leftSquareLocation.x}
                                        y1={leftSquareLocation.y}
                                        x2={leftSquareLocation.x}
                                        y2={location.y}
                                        stroke={connectorColor}
                                        strokeWidth={1}
                                    />
                                    <line
                                        x1={leftSquareLocation.x}
                                        y1={location.y}
                                        x2={location.x}
                                        y2={location.y}
                                        stroke={connectorColor}
                                        strokeWidth={1}
                                    />
                                    // some space between the fillter and the border
                                    <circle fill={background} cx={location.x} cy={location.y} r={productGutter} />
                                    <Arc
                                        r={productGutter + 1}
                                        x={location.x}
                                        y={location.y}
                                        theta1={-40}
                                        theta2={230}
                                        stroke={connectorColor}
                                    />
                                </React.Fragment>
                            )
                        })}
                        // render the lines joining the right square to each of its results
                        {factory.outputs.map(result => (
                            <React.Fragment key={result.id}>
                                // a vertical line from the square to the corner
                                <line
                                    x1={rightSquareLocation.x}
                                    y1={rightSquareLocation.y}
                                    x2={rightSquareLocation.x}
                                    y2={result.product.position.y}
                                    stroke={connectorColor}
                                    strokeWidth={1}
                                />
                                // a horizontal line from the corner to the product
                                <line
                                    x1={rightSquareLocation.x}
                                    y1={result.product.position.y}
                                    x2={result.product.position.x}
                                    y2={result.product.position.y}
                                    stroke={connectorColor}
                                    strokeWidth={1}
                                />
                                // some space between the fillter and the border
                                <circle
                                    fill={background}
                                    cx={result.product.position.x}
                                    cy={result.product.position.y}
                                    r={productGutter}
                                />
                                // the arc that leaves the gap on the right
                                <Arc
                                    r={productGutter + 1}
                                    x={result.product.position.x}
                                    y={result.product.position.y}
                                    theta1={-230}
                                    theta2={40}
                                    stroke={connectorColor}
                                />
                            </React.Fragment>
                        ))}
                    </React.Fragment>
                )
            })}
        </g>
    )
}

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
                products {
                    position {
                        x
                        y
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
