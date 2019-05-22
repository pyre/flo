// external imports
import React from 'react'
import { graphql, createFragmentContainer } from 'react-relay'
import pluralize from 'pluralize'
import { css } from 'glamor'
// local imports
import { Factory, FactoryIO } from '~/components'
import SidebarEntry from './SidebarEntry'

const FactorySidebarEntry = ({ factory }) => (
    <SidebarEntry
        icon={<Factory />}
        title={factory.name}
        description={<FactoryIO factory={factory} />}
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
            ...FactoryIO_factory
        }
    `,
})
