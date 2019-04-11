// external imports
import React, { useContext } from 'react'
import { css } from 'glamor'
// local imports
import * as styles from './styles'
import { Diagram } from '~/context'
import NoSelection from './NoSelection'
import WithSelection from './WithSelection'

export default () => {
    const { diagram } = useContext(Diagram)

    return (
        <div {...css(styles.container)}>
            {diagram.selectedElements.length === 0 ? <NoSelection /> : <WithSelection />}
        </div>
    )
}
