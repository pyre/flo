// external imports
import React, { useContext } from 'react'
import { css } from 'glamor'
// local imports
import * as styles from './styles'
import { Diagram, Interface } from '~/context'
import NoSelection from './NoSelection'
import WithSelection from './WithSelection'
import { lightGrey } from '~/design'

export default () => {
    // grab the context values we care about
    const { diagram } = useContext(Diagram)
    const { dims } = useContext(Interface)

    return (
        <div
            {...css({
                ...styles.container,
                width: dims.sidebarWidth,
                borderLeft: `solid 1px ${lightGrey}`,
            })}
        >
            {diagram.selectedElements.length === 0 ? <NoSelection /> : <WithSelection />}
        </div>
    )
}
