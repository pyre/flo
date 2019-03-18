// external imports
import React, { useState } from 'react'
import { FlexColumn, SecondaryButton } from 'quark-web'
import { css } from 'glamor'
// local imports
import * as styles from './styles'
import Header from '../Header'
import { darkGrey } from '~/design'

const NoSelection = () => {
    // hold onto some state to toggle between views
    const [view, setView] = useState('application')

    return (
        <FlexRow justifyContent="center">
            <SecondaryButton
                onPress={() => setView('application')}
                style={styles.sidebarSwitcher}
                textStyle={view === 'application' ? styles.activeSwitcherText : styles.switherText}
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
    )
}

export default () => (
    <FlexColumn direction="column" style={{ flex: 1 }}>
        <Header
            icon={<div {...css({
                background: darkGrey,
                borderRadius: 3,
                height: 26,
                width: 26,
            })} />}
            title={<span {...css({ color: darkGrey })}>Nothing selected</span>}
        />
        <div {...css({
            width: 200,
            alignSelf: "center",
            textAlign: "center",
            lineHeight: 1.5,
            display: 'flex',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            color: darkGrey
        })}>
            Choose a factory or product for more info.
        </div>
    </FlexColumn>
)