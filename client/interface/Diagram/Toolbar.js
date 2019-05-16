// external imports
import React, { useContext } from 'react'
import { css } from 'glamor'
// local imports
import { IconInfo } from '~/components'
import { iconColor } from '~/design'
import { Diagram, Interface } from '~/context'

const Toolbar = props => {
    // grab the diagram info from context
    const { toggleTooltips } = useContext(Diagram)
    const { shadows } = useContext(Interface)

    return (
        <div
            {...props}
            {...css({
                backgroundColor: 'white',
                boxShadow: shadows[1],
                borderRadius: 3,
                padding: 10,
            })}
            onClick={toggleTooltips}
        >
            <IconInfo
                {...css({
                    color: iconColor,
                    cursor: 'pointer',
                })}
            />
        </div>
    )
}

export default Toolbar
