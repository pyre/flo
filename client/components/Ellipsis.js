// external import
import React from 'react'
import { css } from 'glamor'

export default props => (
    <span
        {...props}
        {...css({
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
        })}
    />
)
