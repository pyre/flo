// external imports
import React from 'react'
import { createFragmentContainer, graphql } from 'react-relay'
import { css } from 'glamor'
import pluralize from 'pluralize'
// local imports
import { FactoryDiamond } from '~/components'
import { gridStroke } from '~/design'

const SelectedFactory = ({ factory }) => (
    <div {...css({
        display: 'flex',
        flexDirection: 'column',
    })}>
        <div {...css({
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            paddingBottom: 12,
            borderBottom: `1px solid ${gridStroke}`,
        })}>
            <FactoryDiamond style={{ marginRight: 14 }} />
            <div {...css({
                display: 'flex',
                flexDirection: 'column',
            })}>
                <div>
                    {factory.name}
                </div>
                <div>
                    {factory.inputs.length > 0 && (
                        `${factory.inputs.length} ${pluralize("inputs", factory.inputs.length)}`
                    )}

                    {factory.inputs.length > 0 && factory.outputs.length > 0 && (
                        <span {...css({marginLeft: 4, marginRight: 2,})}>·</span>
                    )}
                    
                    {factory.outputs.length > 0 && (
                        `${factory.outputs.length} ${pluralize("outputs", factory.outputs.length)}`
                    )} 
                </div>
            </div>
        </div>
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
        }
    `
)
