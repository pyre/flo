// external imports
import React from 'react'
import { createFragmentContainer, graphql } from 'react-relay'
// local imports
import { elementOutline, factoryPrimary } from '~/colors'

// the primary length for the central daimon
const diamondLength = 10

const Factory = ({
    factory: {
        position: { x, y },
    },
}) => (
    <>
        // the center of a factory is the daimond used as the target for clicks
        <polygon
            fill={factoryPrimary}
            stroke={elementOutline}
            strokeWidth={2}
            strokeLinejoin="round"
            points={`${x - diamondLength},${y} ${x},${y + diamondLength} ${x +
                diamondLength},${y} ${x},${y - diamondLength}`}
        />
    </>
)

export default createFragmentContainer(
    Factory,
    graphql`
        fragment Factory_factory on Factory {
            position {
                x
                y
            }
        }
    `
)
