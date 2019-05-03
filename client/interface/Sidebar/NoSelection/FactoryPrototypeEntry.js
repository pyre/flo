// external imports
import React from 'react'
import { graphql, createFragmentContainer } from 'react-relay'

const FactoryPrototypeEntry = ({ factory }) => <div>{factory.id}</div>

export default createFragmentContainer(FactoryPrototypeEntry, {
    factory: graphql`
        fragment FactoryPrototypeEntry_factory on Factory {
            id
        }
    `,
})
