// external imports
import React from 'react'
import { css } from 'glamor'
// local imports
import { productColor } from '~/design'

export const baseStyle = css({
    background: 'none',
    border: 'none',
    height: 40,
    fontSize: 14,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 4,
    minWidth: 125,
})

const PrimaryButton = props => (
    <button
        {...props}
        {...baseStyle}
        {...css({
            backgroundColor: productColor,
            color: 'white',
        })}
    />
)

export default PrimaryButton
