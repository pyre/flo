// externals
import React, { useRef, useContext, useEffect } from 'react'
// local imports
import { useMouseDrag, useNormalDelta } from '~/hooks'
import { DiagramContext } from '~/state'

const Draggable = ({ id, children, origin, onMove }) => {
    const elementRef = useRef(null)

    // track the movement of the mouse
    const mouseDrag = useMouseDrag(elementRef)
    const { diagram, selectElements } = useContext(DiagramContext)

    // we need to make sure that we are seleted if we are dragging
    useEffect(
        () => {
            mouseDrag && selectElements(id)
        },
        [mouseDrag.origin, id]
    )

    // compute the amount we've moved in the x direction
    const deltaX = useNormalDelta(mouseDrag && mouseDrag.currentLocation.x - origin.x)
    // compute the amount we've moved in the y direction
    const deltaY = useNormalDelta(mouseDrag && mouseDrag.currentLocation.y - origin.y)

    // we need to kick off the onMove handler if we have moved beyond a grid cell
    useEffect(
        () => {
            // if we are dragging the draggable beyond a grid cell
            if (Math.abs(deltaX) > 0.5 || Math.abs(deltaY) > 0.5) {
                // we have to figure out the new coordinates for the element
                const coordinates = origin

                // round the two deltas to the nearest whole number of grid cells
                const [roundX, roundY] = [deltaX, deltaY].map(Math.round).map(coord => coord * diagram.gridSize)

                // the new coordinates for the object
                const newX = origin.x + roundX
                const newY = origin.y + roundY

                // trigger the move handlers
                onMove && onMove({ x: newX, y: newY })
            }
        },
        [deltaX, deltaY]
    )

    return <g ref={ref => (elementRef.current = ref)}>{children}</g>
}

export default Draggable
