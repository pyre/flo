// external imports
import React from 'react'
import { css } from 'glamor'
// local imports
import { gridStroke } from '~/design'

const SelectionHeader = ({ icon, title, subtitle }) => (
    <div {...css({
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 12,
        borderBottom: `1px solid ${gridStroke}`,
    })}>
        {icon}
        <div {...css({
            display: 'flex',
            flexDirection: 'column',
        })}>
            <div>
                {title}
            </div>
            <div>
                { subtitle }
            </div>
        </div>
    </div>
)

export default SelectionHeader