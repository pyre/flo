// external imports
import React, { useRef, useContext } from 'react'
import { graphql, createFragmentContainer } from 'react-relay'
import { css, hover } from 'glamor'
// local imports
import { Product } from '~/components'
import { useMouseDrag, useRelativePosition } from '~/hooks'
import { lightGrey, darkGrey } from '~/design'
import { Diagram, Interface } from '~/context'
import { round } from '~/utils'

const ProductEntry = ({ product }) => {
    // a ref to the root of the list item
    const rootElement = useRef()

    // get the diagram info
    const { diagram } = useContext(Diagram)
    const { dims } = useContext(Interface)

    // we need to track mouse drags on the element
    const drag = useMouseDrag(rootElement)
    // the location to show the shadow
    let shadowLocation = null

    // we need to compute the relative position but if we're not dragging just pass null
    // NOTE: this is here and not in the `if (drag) { ... }` because of the Rule of Hooks
    const relativePosition = useRelativePosition(drag ? drag.currentLocation : null)

    // we only want to show the shadow if we are dragging
    if (drag) {
        // the shadow should follow the mouse as closely as possible
        shadowLocation = drag.currentLocation

        // the width of the diagram
        const diagramWidth = window.innerWidth - dims.sidebarWidth

        // if we are dragging the shadow outside of the sidebar
        if (drag.currentLocation.x < diagramWidth) {
            // grab the diagram info we need
            const { gridSize, pan } = diagram

            // the x coordinate of the first vertical grid line visible
            const gridLeftX = pan.x < 0 ? gridSize + (pan.x % gridSize) : pan.x % gridSize
            // compute the difference between the left grid and the mouse
            const nGridsWide = round(drag.currentLocation.x - gridLeftX, gridSize)

            let shadowX = gridLeftX + nGridsWide
            // if the shadow is going to end up in the sidebar
            if (shadowX > diagramWidth) {
                // make sure the shadow stays in the diagram
                shadowX -= gridSize
            }

            // the y coordinate of the first horzintaol grid line visible
            const gridTopY = pan.y < 0 ? gridSize + (pan.y % gridSize) : pan.y % gridSize
            // compute the difference between the left grid and the mouse
            const nGridsTall = round(drag.currentLocation.y - gridTopY, gridSize)

            // the y coordinate of the first horizontal grid line visible
            // we should snap the shadow to the grid
            shadowLocation = {
                x: shadowX,
                y: gridTopY + nGridsTall,
            }
        }
    }

    return (
        <>
            <div
                ref={rootElement}
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
                <Product progress={1} {...css({ marginRight: 12 })} />
                <div {...css({ display: 'flex', flexDirection: 'column' })}>
                    <div {...css({ lineHeight: '16px' })}>{product.name}</div>
                    <div {...css({ color: darkGrey })}>{product.description}</div>
                </div>
            </div>
            {shadowLocation && (
                <Product
                    progress={1}
                    style={{
                        position: 'fixed',
                        top: shadowLocation.y,
                        left: shadowLocation.x,
                        transform: 'translateX(-50%) translateY(-50%)',
                    }}
                />
            )}
        </>
    )
}

export default createFragmentContainer(
    ProductEntry,
    graphql`
        fragment ProductEntry_product on Product {
            name
            description
        }
    `
)
