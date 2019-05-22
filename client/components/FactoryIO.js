// externals
import React from 'react'
import pluralize from 'pluralize'
import { createFragmentContainer, graphql } from 'react-relay'
import { css } from 'glamor'

const FactoryIO = ({ factory }) => (
    <>
        {factory.inputs.length > 0 && `${factory.inputs.length} ${pluralize('input', factory.inputs.length)}`}
        {factory.inputs.length > 0 && factory.outputs.length > 0 && (
            <span {...css({ marginLeft: 4, marginRight: 2 })}>· </span>
        )}
        {factory.outputs.length > 0 && `${factory.outputs.length} ${pluralize('output', factory.outputs.length)}`}{' '}
    </>
)

export default createFragmentContainer(
    FactoryIO,
    graphql`
        fragment FactoryIO_factory on Factory {
            inputs {
                id
            }
            outputs {
                id
            }
        }
    `
)
