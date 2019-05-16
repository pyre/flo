// external imports
import React, { useContext } from 'react'
import { css } from 'glamor'
// local imports
import { IconInfo, Portal } from '~/components'
import { iconColor } from '~/design'
import { Diagram, Interface } from '~/context'

const Toolbar = props => {
    // grab the diagram info from context
    const { toggleTooltips } = useContext(Diagram)
    const { shadows, dims } = useContext(Interface)

    return (
        <Portal id="toolbar">
            <div
                {...props}
                {...css({
                    backgroundColor: 'white',
                    boxShadow: shadows[1],
                    borderRadius: 3,
                    padding: 10,
                    zIndex: 100,
                    position: 'fixed',
                    right: dims.sidebarWidth + 32,
                    bottom: 32,
                    cursor: 'pointer',
                })}
                onClick={toggleTooltips}
            >
                <IconInfo
                    {...css({
                        color: iconColor,
                    })}
                />
            </div>
        </Portal>
    )
}

export default Toolbar
