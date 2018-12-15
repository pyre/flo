// external imports
import React, { useContext } from 'react'
import { FlexColumn, FlexRow, SecondaryButton } from 'quark-web'
// local imports
import * as styles from './styles'
import { DiagramContext } from '~/state'
import NoSelection from './NoSelection'

export default () => {
    const { diagram } = useContext(DiagramContext)

    return (
        <FlexColumn style={styles.container}>
            {diagram.selectedElements.length === 0 && <NoSelection />}
        </FlexColumn>
    )
}
