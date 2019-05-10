// external imports
import React, { useContext } from 'react'
import { css } from 'glamor'
// local imports
import { IconInfo } from '~/components'
import { iconColor } from '~/design'
import { Diagram } from '~/context'

const Toolbar = props => {
    // grab the diagram info from context
    const { diagram } = useContext(Diagram)

    return (
        <div
            {...props}
            {...css({
                backgroundColor: 'white',
                boxShadow: '0 3px 6px rgba(0,0,0,0.19), 0 3px 6px rgba(0,0,0,0.23)',
                borderRadius: 3,
            })}
        >
            <IconInfo
                {...css({
                    color: iconColor,
                    padding: 10,
                    cursor: 'pointer',
                })}
                onClick={diagram.toggleTooltips}
            />
        </div>
    )
}

export default Toolbar
