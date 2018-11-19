// external imports
import React from 'react'
import { createFragmentContainer, graphql } from 'react-relay'
// local imports
import Factory from './Factory'

const Flo = ({ flo }) => (
    <>
        {flo.factories.map(factory => (
            <Factory key={factory.id} factory={factory} />
        ))}
    </>
)

export default createFragmentContainer(
    Flo,
    graphql`
        fragment Flo_flo on Flo {
            factories {
                id
                ...Factory_factory
            }
        }
    `
)
