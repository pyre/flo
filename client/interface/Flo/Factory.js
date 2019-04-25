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
*/

// the primary length for the central daimond
const diamondLength = 12

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
        }
    `
)
