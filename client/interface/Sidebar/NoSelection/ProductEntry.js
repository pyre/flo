// external imports
import React, { useRef, useContext, useEffect } from 'react'
import { graphql, createFragmentContainer } from 'react-relay'
import { css, hover } from 'glamor'
// local imports
import { Product } from '~/components'
import { useMouseDrag, useRelativePosition } from '~/hooks'
import { lightGrey, darkGrey } from '~/design'
import { Diagram, Environment, Interface } from '~/context'
import { round, mutate } from '~/utils'

const ProductEntry = ({ product }) => {
    // a ref to the root of the list item
    const rootElement = useRef()

    // get the diagram info
    const { diagram, selectElements } = useContext(Diagram)
    const { dims } = useContext(Interface)

    // we need to track mouse drags on the element
    const drag = useMouseDrag(rootElement)
    // the location to show the shadow
    let shadowLocation = null

    // in order to handle when the user lets go we need a ref that designates
    // if we are dragging
    const isDragging = useRef(null)

    // we only want to show the shadow if we are dragging
    if (drag && (drag.origin.x != drag.currentLocation.x || drag.origin.y != drag.currentLocation.y)) {
        // save a reference to the current location
        const { currentLocation } = drag

        // the shadow should follow the mouse as closely as possible
        shadowLocation = currentLocation

        // the width of the diagram
        const diagramWidth = window.innerWidth - dims.sidebarWidth

        // if we are dragging the shadow outside of the sidebar
        if (currentLocation.x < diagramWidth) {
            // grab the diagram info we need
            const { gridSize, pan } = diagram

            // the x coordinate of the first vertical grid line visible
            const gridLeftX = pan.x < 0 ? gridSize + (pan.x % gridSize) : pan.x % gridSize
            // compute the difference between the left grid and the mouse
            const nGridsWide = round(currentLocation.x - gridLeftX, gridSize)

            let shadowX = gridLeftX + nGridsWide
            // if the shadow is going to end up in the sidebar
            if (shadowX > diagramWidth) {
                // make sure the shadow stays in the diagram
                shadowX -= gridSize
            }

            // the y coordinate of the first horzintaol grid line visible
            const gridTopY = pan.y < 0 ? gridSize + (pan.y % gridSize) : pan.y % gridSize
            // compute the difference between the left grid and the mouse
            const nGridsTall = round(currentLocation.y - gridTopY, gridSize)

            // the y coordinate of the first horizontal grid line visible
            // we should snap the shadow to the grid
            shadowLocation = {
                x: shadowX,
                y: gridTopY + nGridsTall,
            }
        }

        // make sure we track that we are dragging
        isDragging.current = shadowLocation
    }

    // grab the relay environment
    const environment = useContext(Environment)

    // when we let go, we need to set the mutation that creates the product
    useEffect(() => {
        // if we are no longer dragging but we just were
        if (!drag && isDragging.current) {
            mutate({
                environment,
                query: graphql`
                    mutation ProductEntryAddProductMutation($input: AddProductInput!) {
                        addProductToFlo(input: $input) {
                            product {
                                id
                            }
                        }
                    }
                `,
                variables: {
                    input: {
                        ...isDragging.current,
                        flo: 'RmxvOjA=',
                        product: '1',
                    },
                },
            }).then(({ addProductToFlo: { product: { id } } }) => {
                // select the product we just added
                selectElements(id)
            })

            // make sure we only do this once
            isDragging.current = null
        }

        // this effect needs to fire any time we are dragging or just finishe dragging
    }, [drag, isDragging.current])

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
