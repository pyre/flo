// externals
import React, { useRef, useContext, useEffect } from 'react'
// local imports
import { useMouseDrag } from '~/hooks'
import { DiagramContext } from '~/state'

const Draggable = ({ id, children, onMove, origin }) => {
    const elementRef = useRef(null)

    // track the movement of the mouse
    const mouseDrag = useMouseDrag(elementRef)
    const { diagram, selectElements } = useContext(DiagramContext)

    // we need to make sure that we are seleted if we are dragging
    useEffect(
        () => {
            mouseDrag && (console.log('selecting', id) || selectElements(id))
        },
        [mouseDrag.origin, id]
    )

    // if we are dragging the mouse and the delta is greater
    // than half of the grid size after applying zoom
    if (mouseDrag) {
        console.log('dragging draggable', id)
    }

    return <g ref={ref => (elementRef.current = ref)}>{children}</g>
}

export default Draggable
