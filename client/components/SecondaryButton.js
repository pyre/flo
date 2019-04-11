// external imports
import React from 'react'
import { css } from 'glamor'

// local imports
import { baseStyle } from './PrimaryButton'

const SecondaryButton = props => (
    <button
        {...props}
        {...baseStyle}
        {...css({
            background: 'none',
            border: 'none',
        })}
    />
)

export default SecondaryButton
