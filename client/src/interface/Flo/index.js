// external imports
import React from 'react'
import { createFragmentContainer, graphql } from 'react-relay'

const Flo = ({ flo }) => (
    <>
        {flo.factories.map(factory => (
            <circle cx={factory.position.x} cy={factory.position.y} r={2} />
        ))}
    </>
)

export default createFragmentContainer(
    Flo,
    graphql`
        fragment Flo_flo on Flo {
            factories {
                position {
                    x
                    y
                }
            }
        }
    `
)
