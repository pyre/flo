// external imports
import React, { useRef, useEffect, useContext } from 'react'
import SvgMatrix from 'svg-matrix'
// local imports
import { useKeyPress, useMouseDrag, useEvent } from '~/hooks'
import { DiagramContext } from '~/state'
import Grid from './Grid'
import SelectionRectangle from './SelectionRectangle'
import * as styles from './styles'

export default () => {
    // grab the info and actions we need from the diagram
    const { diagram } = useContext(DiagramContext)

    // we need a ref to track if the mouse is clicked on the element
    const elementRef = useRef(null)

    // we care if the space bar is pressed
    const spacePressed = useKeyPress(' ')

    // track the movement of the mouse
    const mouseDrag = useMouseDrag(elementRef.current, [spacePressed])

    // enable the zoom behavior
    useZoomBehavior(elementRef)
    // and the drag behavior
    useDragBehavior({ spacePressed, mouseDrag })

    // wether or not we're panning the diagram
    const panning = spacePressed && mouseDrag

    // compute the transform string for the diagram
    const { transformString } = SvgMatrix()
        .translate(diagram.pan.x, diagram.pan.y)
        .scale(diagram.zoomLevel)

    return (
        <svg style={styles.container} ref={elementRef}>
            <g transform={transformString}>
                <Grid />
                {!panning &&
                    mouseDrag.origin && (
                        <SelectionRectangle
                            point1={mouseDrag.origin}
                            point2={mouseDrag.currentLocation}
                        />
                    )}
            </g>
        </svg>
    )
}

const useDragBehavior = ({ mouseDrag, spacePressed }) => {
    const { pan } = useContext(DiagramContext)

    // the keyboard interactions have all sorts of effects
    useEffect(
        () => {
            // if the space bar is pressed and the mouse is being moved
            if (spacePressed && mouseDrag) {
                // pan the diagram
                pan(mouseDrag.delta)
            }
        },
        [spacePressed, mouseDrag && mouseDrag.delta.x, mouseDrag && mouseDrag.delta.y]
    )
}

const useZoomBehavior = elementRef => {
    // grab the info and actions we need from the diagram
    const { zoomIn, zoomOut } = useContext(DiagramContext)

    // when the wheel scrolls
    useEvent('mousewheel', event => {
        // make sure that the scrolling only happens on the diagram
        if (event.target !== elementRef.current) {
            return
        }

        // if the user scrolled up
        if (event.wheelDelta / 120 > 0) {
            // zoom in
            zoomIn()
            // otherwise we scrolled down
        } else {
            // zoom the diagram out
            zoomOut()
        }
    })
}
