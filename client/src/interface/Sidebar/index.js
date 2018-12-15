// external imports
import React, { useState } from 'react'
import { FlexColumn, FlexRow, SecondaryButton } from 'quark-web'
// local imports
import * as styles from './styles'

export default () => {
    // hold onto some state to toggle between views
    const [view, setView] = useState('application')

    return (
        <FlexColumn style={styles.container}>
            <FlexRow justifyContent="center">
                <SecondaryButton
                    onPress={() => setView('application')}
                    style={styles.sidebarSwitcher}
                    textStyle={
                        view === 'application' ? styles.activeSwitcherText : styles.switherText
                    }
                >
                    Application
                </SecondaryButton>
                <SecondaryButton
                    onPress={() => setView('library')}
                    style={styles.sidebarSwitcher}
                    textStyle={view === 'library' ? styles.activeSwitcherText : styles.switherText}
                >
                    Library
                </SecondaryButton>
            </FlexRow>
        </FlexColumn>
    )
}
