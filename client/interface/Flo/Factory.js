// external imports
import React, { useContext } from 'react'
import { createFragmentContainer, graphql } from 'react-relay'
// local imports
import {
    elementOutline,
    factoryPrimary,
    selectedBorderWidth,
    selectedBorderGap,
    background,
    factorySelectedBorder,
} from '~/design'
import { useSubscription } from '~/hooks'
import { Diagram, Environment } from '~/context'
import { Draggable, Factory as FactoryDiamond } from '~/components'
import { mutate } from '~/utils'

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
const diamondLength = 12
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

    // grab the diagram state
    const { diagram } = useContext(Diagram)
    const environment = useContext(Environment)

    // pull out the selected element
    const [selectedID] = diagram.selectedElements

    // make sure we update this component when the product moves
    useSubscription(
        graphql`
            subscription FactorySubscription($id: ID!) {
                node(id: $id) {
                    ... on Factory {
                        position {
                            x
                            y
                        }
                    }
                }
            }
        `,
        {
            id: factory.id,
        }
    )

    return (
        <>
            // there is a line going from one square to the other
            <line stroke={elementOutline} strokeWidth={1} x1={x + armLength} y1={y} y2={y} x2={x - armLength} />
            // render the lines joining the left square to each of the inputs
            {factory.inputs.map((binding, i) => (
                <React.Fragment key={binding.id}>
                    <line
                        x1={leftSquareLocation.x}
                        y1={leftSquareLocation.y}
                        x2={leftSquareLocation.x}
                        y2={binding.product.position.y}
                        stroke={elementOutline}
                        strokeWidth={1}
                    />
                    <line
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
                        x1={rightSquareLocation.x}
                        y1={rightSquareLocation.y}
                        x2={rightSquareLocation.x}
                        y2={result.product.position.y}
                        stroke={elementOutline}
                        strokeWidth={1}
                    />
                    <line
                        x1={rightSquareLocation.x}
                        y1={result.product.position.y}
                        x2={result.product.position.x}
                        y2={result.product.position.y}
                        stroke={elementOutline}
                        strokeWidth={1}
                    />
                </React.Fragment>
            ))}
            // only show the input rectangle if there is more than one product
            {factory.inputs.length !== 1 && (
                <rect
                    fill={elementOutline}
                    x={leftSquareLocation.x - squareLength}
                    y={leftSquareLocation.y - squareLength}
                    width={2 * squareLength}
                    height={2 * squareLength}
                />
            )}
            // only show the output rectangle if there is more than one result
            {factory.outputs.length !== 1 && (
                <rect
                    fill={elementOutline}
                    x={rightSquareLocation.x - squareLength}
                    y={rightSquareLocation.y - squareLength}
                    width={2 * squareLength}
                    height={2 * squareLength}
                />
            )}
            // the center of a factory is the diamond used as the target for clicks
            <Draggable
                id={factory.id}
                origin={{ x, y }}
                onMove={position =>
                    mutate({
                        environment,
                        query: graphql`
                            mutation FactoryMovefactoryMutation($factory: ID!, $x: Int!, $y: Int!) {
                                moveFactory(factory: $factory, x: $x, y: $y) {
                                    factory {
                                        id
                                        position {
                                            x
                                            y
                                        }
                                    }
                                }
                            }
                        `,
                        variables: { factory: factory.id, ...position },
                        optimisticResponse: {
                            moveFactory: {
                                factory: {
                                    id: factory.id,
                                    position,
                                },
                            },
                        },
                    })
                }
            >
                <FactoryDiamond
                    x={x}
                    y={y}
                    center={true}
                    style={{ cursor: 'pointer' }}
                    selected={factory.id === selectedID}
                />
            </Draggable>
        </>
    )
}

export default createFragmentContainer(
    Factory,
    graphql`
        fragment Factory_factory on Factory {
            id
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
