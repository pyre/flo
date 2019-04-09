// external imports
import React from 'react'
import { css, focus } from 'glamor'
// local imports
import { productColor } from '~/design'

const Input = ({ onChange = () => {}, ...props }) => (
    <input
        {...css({
            fontSize: 14,
            padding: 8,
            outline: 'none',
            border: '1px solid',
            borderColor: 'rgb(234, 234, 238)',
            borderRadius: 3,
            transitionDuration: '150ms',
            transitionProperty: 'border',
            transitionTimingFunction: 'ease-in-out',
        })}
        {...focus({
            borderColor: productColor,
        })}
        {...props}
        onChange={evt => {
            evt.persist()
            onChange(evt.target.value)
        }}
    />
)

export default Input
