// external imports
import { graphql } from 'react-relay'
import React, { useRef, useEffect, useContext } from 'react'
import SvgMatrix from 'svg-matrix'
// local imports
import { Query } from '~/components'
import { Flo } from '~/interface'
import { DiagramContext } from '~/state'
import { useKeyPress, useMouseDrag, useEvent } from '~/hooks'
import Grid from './Grid'
import SelectionRectangle from './SelectionRectangle'
import * as styles from './styles'

export default () => {
    // we need a ref to track interactions with the diagram
    const elementRef = useRef(null)

    // enable the mousewheel zoom behavior
    // useZoomBehavior(elementRef)
    // and the drag behavior
    useDragBehavior(elementRef)

    // grab the info and actions we need from the diagram
    const { diagram } = useContext(DiagramContext)

    // compute the transform string for the diagram
    const { transformString } = SvgMatrix()
        .translate(diagram.pan.x, diagram.pan.y)
        .scale(diagram.zoomLevel)

    return (
        <svg style={styles.container} ref={elementRef}>
            <g transform={transformString}>
                <Grid />

                {/* make sure the diagram sits above the grid */}
                <Query query={floQuery} variables={{ id: 'RmxvOjE=' }} loadingState={null}>
                    {({ node }) => <Flo flo={node} />}
                </Query>
            </g>
        </svg>
    )
}

// the query for the flo we're looking at
const floQuery = graphql`
    query DiagramQuery($id: ID!) {
        node(id: $id) {
            ... on Flo {
                ...Flo_flo
            }
        }
    }
`

const useDragBehavior = elementRef => {
    const { pan } = useContext(DiagramContext)
    // we care if the space bar is pressed
    const spacePressed = useKeyPress(' ')

    // track the movement of the mouse
    const mouseDrag = useMouseDrag(elementRef.current, [spacePressed])

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

    // this hook returns wether or not to show the selection rectangle while dragging
    return (
        mouseDrag &&
        !spacePressed && {
            point1: mouseDrag.origin,
            point2: mouseDrag.currentLocation,
        }
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
