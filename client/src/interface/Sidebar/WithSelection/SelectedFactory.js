// external imports
import React from 'react'
import { createFragmentContainer, graphql } from 'react-relay'
import { css } from 'glamor'
import pluralize from 'pluralize'
import { Label, TextInput, SecondaryButton, PrimaryButton } from 'quark-web'
// local imports
import { Factory } from '~/components'
import Header from '../Header'

const SelectedFactory = ({ factory }) => {
    const initialState = factory.config.reduce(
        (prev, config) => ({
            ...prev,
            [config.key]: config.value,
        }),
        {}
    )

    // copy the factory's config into local state
    const [config, setConfig] = React.useState(initialState)

    // a piece of state to track if we've modified the factory
    const [modified, setModified] = React.useState(false)

    return (
        <>
            <div
                {...css({
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    position: 'relative',
                    overflowY: 'auto',
                })}
            >
                <Header
                    icon={<Factory />}
                    title={factory.name}
                    subtitle={
                        <>
                            {factory.inputs.length > 0 &&
                                `${factory.inputs.length} ${pluralize('input', factory.inputs.length)}`}

                            {factory.inputs.length > 0 &&
                                factory.outputs.length > 0 && (
                                    <span {...css({ marginLeft: 4, marginRight: 2 })}>·</span>
                                )}

                            {factory.outputs.length > 0 &&
                                `${factory.outputs.length} ${pluralize('output', factory.outputs.length)}`}
                        </>
                    }
                />
                {factory.config.map(({ key, value, kind }) => (
                    <React.Fragment key={key}>
                        <Label value={key} style={{ marginBottom: 12 }}>
                            <TextInput
                                {...css({
                                    marginBottom: 10,
                                })}
                                value={config[key]}
                                onChange={value => {
                                    // update the local state for the config value
                                    setConfig(state => ({
                                        ...state,
                                        [key]: value,
                                    }))

                                    // mark the form as updated
                                    setModified(true)
                                }}
                            />
                        </Label>
                    </React.Fragment>
                ))}
            </div>
            {modified && (
                <div
                    {...css({
                        display: 'flex',
                        alignSelf: 'flex-end',
                        bottom: 0,
                        background: 'white',
                        height: 30,
                        justifyContent: 'flex-end',
                        width: `100%`,
                        paddingBottom: 30,
                    })}
                >
                    <SecondaryButton
                        onPress={() => {
                            // hide the buttons
                            setModified(false)

                            // reset the form
                            setConfig(initialState)
                        }}
                    >
                        cancel
                    </SecondaryButton>
                    <PrimaryButton
                        onPress={() => {
                            console.log('submitting new config', config)

                            // hide the buttons
                            setModified(false)
                        }}
                    >
                        save
                    </PrimaryButton>
                </div>
            )}
        </>
    )
}

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
