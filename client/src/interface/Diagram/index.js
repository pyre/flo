// external imports
import React, { useRef, useEffect, useContext } from 'react'
import SvgMatrix from 'svg-matrix'
// local imports
import { useKeyPress, useMouseDrag } from '~/hooks'
import { DiagramContext } from '~/state'
import Grid from './Grid'
import * as styles from './styles'

export default () => {
    // we need a ref to track if the mouse is clicked on the element
    const elementRef = useRef(null)

    // we care if the space bar is pressed
    const spacePressed = useKeyPress(' ')
    // track the movement of the mouse
    const mouseDrag = useMouseDrag(elementRef.current, [spacePressed])

    // grab the info and actions we need from the diagram
    const { pan, diagram } = useContext(DiagramContext)

    // the keyboard interactions have all sorts of effects
    useEffect(
        () => {
            // if the space bar is pressed and the mouse is being moved
            if (spacePressed && mouseDrag) {
                console.log('dragging', mouseDrag.delta)
                // pan the diagram
                pan(mouseDrag.delta)
            }
        },
        [spacePressed, mouseDrag && mouseDrag.delta.x, mouseDrag && mouseDrag.delta.y]
    )

    // compute the transform string for the diagram
    const { transformString } = SvgMatrix()
        .translate(diagram.pan.x, diagram.pan.y)
        .scale(diagram.zoomLevel)

    return (
        <svg style={styles.container} ref={elementRef}>
            <g transform={transformString}>
                <Grid />
            </g>
        </svg>
    )
}
