// external imports
import React from 'react'
import { createFragmentContainer, graphql } from 'react-relay'
import { css } from 'glamor'
import pluralize from 'pluralize'
// local imports
import { Factory, Label } from '~/components'
import Header from '../Header'

const SelectedFactory = ({ factory }) => (
    <div {...css({
        display: 'flex',
        flexDirection: 'column',
    })}>
        <Header
            icon={<Factory />}
            title={factory.name}
            subtitle={
                <>
                    {factory.inputs.length > 0 && (
                        `${factory.inputs.length} ${pluralize("inputs", factory.inputs.length)}`
                    )}

                    {factory.inputs.length > 0 && factory.outputs.length > 0 && (
                        <span {...css({ marginLeft: 4, marginRight: 2, })}>·</span>
                    )}

                    {factory.outputs.length > 0 && (
                        `${factory.outputs.length} ${pluralize("outputs", factory.outputs.length)}`
                    )}
                </>
            }
        />
        {factory.config.map(({ key, value, kind }) => (
            <React.Fragment key={key}>
                <Label>{key}</Label>
                <input {...css({ marginBottom: 10 })} value={value} />
            </React.Fragment>
        ))}
    </div>
)

export default createFragmentContainer(
    SelectedFactory,
    graphql`
        fragment SelectedFactory_factory on Factory {
            name
            attributes {
                value
                kind
            }
            inputs {
                name
            }
            outputs {
                name
            }
            config {
                key
                value
                kind
            }
        }
    `
)
