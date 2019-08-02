// external imports
import React, { useContext } from 'react'
import { createFragmentContainer, graphql } from 'react-relay'
// local imports
import { Arc } from '~/components'
import { Interface } from '~/context'
import { useSubscription, useEnvironment } from '~/hooks'
import { Draggable } from '~/components'
import { mutate } from '~/utils'

// the primary length for the squares that define the in and out point
const squareLength = 3
// the distance from the central diamond to the square
const armLength = 50
// the radius of the inner circle that prevents the grid leaking under a product
const productGutter = 15

const Lines = ({ flo }) => {
    const {
        colors: { connectorColor },
    } = useContext(Interface)

    // the position of bindings can change
    useSubscription(
        graphql`
            subscription Lines2DSubscription($id: ID!) {
                node(id: $id) {
                    ...Lines2D_flo
                }
            }
        `,
        {
            id: flo.id,
        }
    )

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
                            const location = binding.position

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
                                    // some space between the filler and the border
                                    <Binding binding={binding} />
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
                                    y2={result.position.y}
                                    stroke={connectorColor}
                                    strokeWidth={1}
                                />
                                // a horizontal line from the corner to the product
                                <line
                                    x1={rightSquareLocation.x}
                                    y1={result.position.y}
                                    x2={result.position.x}
                                    y2={result.position.y}
                                    stroke={connectorColor}
                                    strokeWidth={1}
                                />
                                // some space between the fillter and the border
                                <Binding binding={result} />
                                // the arc that leaves the gap on the right
                                <Arc
                                    r={productGutter + 1}
                                    x={result.position.x}
                                    y={result.position.y}
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

function Binding({ binding }) {
    const {
        colors: { background },
    } = useContext(Interface)

    const environment = useEnvironment()

    return (
        <Draggable
            id={binding.id}
            origin={binding.position}
            onMove={position =>
                mutate({
                    environment,
                    query: graphql`
                        mutation Lines2DMoveBindingMutation($input: MoveBindingInput!) {
                            moveBinding(input: $input) {
                                binding {
                                    id
                                    position {
                                        x
                                        y
                                    }
                                }
                            }
                        }
                    `,
                    variables: { input: { binding: binding.id, ...position } },
                    optimisticResponse: {
                        moveBinding: {
                            binding: {
                                id: binding.id,
                                position,
                            },
                        },
                    },
                })
            }
        >
            <circle fill={background} cx={binding.position.x} cy={binding.position.y} r={productGutter} />
        </Draggable>
    )
}

export default createFragmentContainer(
    Lines,
    graphql`
        fragment Lines2D_flo on Producer {
            ... on Node {
                id
            }
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
                    position {
                        x
                        y
                    }
                }
                inputs {
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
