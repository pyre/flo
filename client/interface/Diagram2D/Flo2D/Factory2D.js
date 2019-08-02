// external imports
import React, { useContext } from 'react'
import { createFragmentContainer, graphql } from 'react-relay'
// local imports
import {
    connectorColor,
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

const Factory = ({
    factory: {
        position: { x, y },
        ...factory
    },
}) => {
    // grab the diagram state
    const { diagram } = useContext(Diagram)
    const environment = useContext(Environment)

    // pull out the selected element
    const [selectedID] = diagram.selectedElements

    // make sure we update this component when the product moves
    useSubscription(
        graphql`
            subscription Factory2DSubscription($id: ID!) {
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
        <Draggable
            id={factory.id}
            origin={{ x, y }}
            onMove={position =>
                mutate({
                    environment,
                    query: graphql`
                        mutation Factory2DMovefactoryMutation($input: MoveFactoryInput!) {
                            moveFactory(input: $input) {
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
                    variables: { input: { factory: factory.id, ...position } },
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
            <FactoryDiamond x={x} y={y} center={true} selected={factory.id === selectedID} />
        </Draggable>
    )
}

export default createFragmentContainer(
    Factory,
    graphql`
        fragment Factory2D_factory on Factory {
            id
            position {
                x
                y
            }
        }
    `
)
