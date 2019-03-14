// external imports
import React from 'react'
import { createFragmentContainer, graphql } from 'react-relay'
import { css } from 'glamor'
// local imports
import { FactoryDiamond } from '~/components'

const SelectedFactory = ({ factory }) => <div {...css({
    display: 'flex',
    flexDirection: 'column',
})}>
    <FactoryDiamond/>
</div>

export default createFragmentContainer(
    SelectedFactory,
    graphql`
        fragment SelectedFactory_factory on Factory {
            name
            attributes {
                value
                kind
            }
        }
    `
)
