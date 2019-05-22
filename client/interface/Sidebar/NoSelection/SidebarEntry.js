// externals
import React, { useContext } from 'react'
import { css, hover } from 'glamor'
// locals
import { Interface } from '~/context'

const SidebarEntry = React.forwardRef(({ icon, title, description, drag, children }, ref) => {
    // grab the current colors
    const {
        colors: { lightGrey, darkGrey },
    } = useContext(Interface)

    // return the entry
    return (
        <div
            ref={ref}
            {...css({
                display: 'flex',
                flexDirection: 'row',
                paddingLeft: 10,
                paddingRight: 10,
                paddingTop: 7,
                paddingBottom: 7,
                alignItems: 'center',
                cursor: 'move',
                userSelect: 'none',
                backgroundColor: drag ? lightGrey : 'none',
            })}
            {...hover({
                backgroundColor: lightGrey,
            })}
        >
            <div {...css({ marginRight: 12 })}>{icon}</div>
            <div {...css({ display: 'flex', flexDirection: 'column' })}>
                <div {...css({ lineHeight: '16px' })}>{title}</div>
                <div {...css({ color: darkGrey })}>{description}</div>
            </div>
        </div>
    )
})

export default SidebarEntry
