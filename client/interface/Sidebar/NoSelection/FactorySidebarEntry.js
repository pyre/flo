// external imports
import React, { useContext } from 'react'
import { graphql, createFragmentContainer } from 'react-relay'
// local imports
import { Factory, FactoryIOString } from '~/components'
import { Environment } from '~/context'
import Flo from '~/interface/Diagram2D/Flo2D'
import SidebarEntry from './SidebarEntry'
import { mutate } from '~/utils'

const FactorySidebarEntry = ({ factory }) => {
    // grab the relay environmenet
    const environment = useContext(Environment)

    // compute the bounding box for the factory so we can wrap it in an SVG
    let leftY = factory.products.reduce((acc, product) => Math.min(product.position.y, acc), Infinity)
    let leftX = factory.products.reduce((acc, product) => Math.min(product.position.x, acc), Infinity)
    let rightY = factory.products.reduce((acc, product) => Math.max(product.position.y, acc), -Infinity)
    let rightX = factory.products.reduce((acc, product) => Math.max(product.position.x, acc), -Infinity)

    // add a padding to the bounds to allow for the visual elements to show
    const padding = 25
    leftY -= padding
    rightY += padding
    leftX -= padding
    rightX += padding

    // the width of the element
    const width = Math.abs(leftX - rightX)
    const height = Math.abs(leftY - rightY)

    // we have to compute the bounds for the shadow of the factory
    return (
        <SidebarEntry
            icon={<Factory />}
            title={factory.name}
            description={<FactoryIOString factory={factory} />}
            shadow={
                <svg
                    width={width}
                    height={height}
                    viewBox={`${leftX} ${leftY} ${width} ${height}`}
                    transform="scale(1,-1)"
                >
                    <Flo producer={factory} />
                </svg>
            }
            onDrop={async position => {
                // create an instance of the factory
                const {
                    addFactoryToFlo: { factory: newFactory },
                } = await mutate({
                    environment,
                    query: graphql`
                        mutation FactorySidebarEntryAddFactoryMutation($input: AddFactoryToFloInput!) {
                            addFactoryToFlo(input: $input) {
                                factory {
                                    id
                                    products {
                                        id
                                    }
                                }
                            }
                        }
                    `,
                    variables: {
                        input: {
                            ...position,
                            factory: factory.id,
                            flo: 'RmxvOjA=',
                        },
                    },
                })

                // we need to select the factory and any products that came with it
                return [newFactory.id, ...newFactory.products.map(({ id }) => id)]
            }}
        />
    )
}

export default createFragmentContainer(FactorySidebarEntry, {
    factory: graphql`
        fragment FactorySidebarEntry_factory on Factory {
            name
            id
            products {
                position {
                    x
                    y
                }
            }

            ...FactoryIOString_factory
            ...Flo2D_producer
        }
    `,
})
