// external imports
import React, { useContext } from 'react'
import { css } from 'glamor'
// local imports
import * as styles from './styles'
import { DiagramContext } from '~/state'
import NoSelection from './NoSelection'
import WithSelection from './WithSelection'

export default () => {
    const { diagram } = useContext(DiagramContext)

    return (
        <div {...css(styles.container)}>
            {diagram.selectedElements.length === 0 ? <NoSelection /> : <WithSelection />}
        </div>
    )
}
