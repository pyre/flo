// external imports
import React, { useState } from 'react'
import { css } from 'glamor'
// local imports
import * as styles from './styles'
import Header from '../Header'
import { darkGrey } from '~/design'

export default () => (
    <div
        {...css({
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
        })}
    >
        <Header
            icon={
                <div
                    {...css({
                        background: darkGrey,
                        borderRadius: 3,
                        height: 26,
                        width: 26,
                    })}
                />
            }
            title={<span {...css({ color: darkGrey })}>Nothing selected</span>}
        />
        <div
            {...css({
                width: 200,
                alignSelf: 'center',
                textAlign: 'center',
                lineHeight: 1.5,
                display: 'flex',
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                color: darkGrey,
            })}
        >
            Choose a factory or product for more info.
        </div>
    </div>
)
