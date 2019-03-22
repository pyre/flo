// external imports
import React from 'react'
import { css } from 'glamor'

const Label = ({ ...props }) => (
    <label
        {...css({
            marginBottom: 2,
        })}
        {...props}
    />
)

export default Label
