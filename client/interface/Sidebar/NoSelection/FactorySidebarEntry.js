// external imports
import React from 'react'
import { graphql, createFragmentContainer } from 'react-relay'
// local imports
import { Factory, FactoryIOString } from '~/components'
import SidebarEntry from './SidebarEntry'

const FactorySidebarEntry = ({ factory }) => (
    <SidebarEntry
        icon={<Factory />}
        title={factory.name}
        description={<FactoryIOString factory={factory} />}
        shadow={<Factory />}
        onDrop={async position => {
            console.log(position)

            return []
        }}
    />
)

export default createFragmentContainer(FactorySidebarEntry, {
    factory: graphql`
        fragment FactorySidebarEntry_factory on Factory {
            name
            inputs {
                id
            }
            outputs {
                id
            }
            ...FactoryIOString_factory
        }
    `,
})
