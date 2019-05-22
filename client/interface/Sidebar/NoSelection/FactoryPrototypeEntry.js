// external imports
import React from 'react'
import { graphql, createFragmentContainer } from 'react-relay'
import pluralize from 'pluralize'
import { css } from 'glamor'
// local imports
import { Factory, FactoryIO } from '~/components'
import SidebarEntry from './SidebarEntry'

const FactoryPrototypeEntry = ({ factory }) => (
    <SidebarEntry icon={<Factory />} title={factory.name} description={<FactoryIO factory={factory} />} />
)

export default createFragmentContainer(FactoryPrototypeEntry, {
    factory: graphql`
        fragment FactoryPrototypeEntry_factory on Factory {
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
