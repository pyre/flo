// external imports
import React, { useContext } from 'react'
import { css } from 'glamor'
// local imports
import { IconInfo, Portal, IconGlobe } from '~/components'
import { iconColor } from '~/design'
import { Diagram, Interface } from '~/context'

const Toolbar = props => {
    // grab the diagram info from context
    const { toggleTooltips } = useContext(Diagram)
    const { dims } = useContext(Interface)

    return (
        <Portal id="toolbar">
            <div
                {...props}
                {...css({
                    position: 'fixed',
                    right: dims.sidebarWidth + 32,
                    bottom: 32,
                    zIndex: 100,

                })}>
                <ToolbarButton onClick={toggleTooltips} >
                    <IconGlobe />
                </ToolbarButton>
                <ToolbarButton onClick={toggleTooltips} >
                    <IconInfo />
                </ToolbarButton>
            </div>
        </Portal>
    )
}

const ToolbarButton = props => {
    // grab the interface shadows
    const { shadows } = useContext(Interface)

    return (
        <button
            {...props}
            {...css({
                backgroundColor: 'white',
                boxShadow: shadows[1],
                borderRadius: 3,
                padding: 10,
                cursor: 'pointer',
                border: 'none',
                color: iconColor,
                marginLeft: 12,
            })}
        />
    )
}

export default Toolbar
