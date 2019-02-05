// external imports
import React from 'react'
import { createFragmentContainer, graphql } from 'react-relay'

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
