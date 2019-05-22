// external imports
import React from 'react'
import { createFragmentContainer, graphql } from 'react-relay'
import { css } from 'glamor'
// local imports
import { Factory, Label, Input, SecondaryButton, PrimaryButton, FactoryIOString } from '~/components'
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
                <Header icon={<Factory />} title={factory.name} subtitle={<FactoryIOString factory={factory} />} />
                {factory.config.map(({ key, value, kind }) => (
                    <React.Fragment key={key}>
                        <Label value={key}>{key}</Label>
                        <Input
                            {...css({
                                marginBottom: 12,
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
                        justifyContent: 'center',
                        width: `100%`,
                        paddingBottom: 20,
                    })}
                >
                    <SecondaryButton
                        onClick={() => {
                            // hide the buttons
                            setModified(false)

                            // reset the form
                            setConfig(initialState)
                        }}
                        {...css({
                            marginRight: 10,
                        })}
                    >
                        cancel
                    </SecondaryButton>
                    <PrimaryButton
                        onClick={() => {
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
            ...FactoryIOString_factory
        }
    `
)
