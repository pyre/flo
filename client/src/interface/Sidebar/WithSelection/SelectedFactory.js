// external imports
import React from 'react'
import { createFragmentContainer, graphql } from 'react-relay'
// local imports
import { SelectedFactory_Factory } from './__generated__/SelectedFactory_Factory.graphql'

const SelectedFactory = ({ factory }) => <div>selected factory</div>

export default createFragmentContainer(
    SelectedFactory,
    graphql`
        fragment SelectedFactory_Factory on Factory {
            name
            attributes {
                value
                kind
            }
        }
    `
)
