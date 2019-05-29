// external imports
import React from 'react'
import { graphql, createFragmentContainer } from 'react-relay'
// local imports
import { Factory, FactoryIOString } from '~/components'
import Flo from '~/interface/Flo'
import SidebarEntry from './SidebarEntry'

const FactorySidebarEntry = ({ factory }) => {
    // compute the bounding box for the factory so we can wrap it in an SVG
    let leftY = factory.products.reduce((acc, product) => Math.min(product.position.y, acc), Infinity)
    let leftX = factory.products.reduce((acc, product) => Math.min(product.position.x, acc), Infinity)
    let rightY = factory.products.reduce((acc, product) => Math.max(product.position.y, acc), -Infinity)
    let rightX = factory.products.reduce((acc, product) => Math.max(product.position.x, acc), -Infinity)

    // add a padding to the bounds to allow for the visual elements to show
    leftY -= 25
    rightY += 25
    leftX -= 25
    rightX += 25

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
                <svg width={width} height={height} viewBox={`${leftX} ${leftY} ${width} ${height}`}>
                    <Flo producer={factory} />
                </svg>
            }
            onDrop={async position => {
                console.log(position)

                // return the
                return []
            }}
        />
    )
}

export default createFragmentContainer(FactorySidebarEntry, {
    factory: graphql`
        fragment FactorySidebarEntry_factory on Factory {
            name
            products {
                position {
                    x
                    y
                }
            }

            ...FactoryIOString_factory
            ...Flo_producer
        }
    `,
})
