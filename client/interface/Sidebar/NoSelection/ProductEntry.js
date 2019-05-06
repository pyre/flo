// external imports
import React, { useRef } from 'react'
import { graphql, createFragmentContainer } from 'react-relay'
import { css, hover } from 'glamor'
// local imports
import { Product } from '~/components'
import { useMouseDrag } from '~/hooks'
import { lightGrey } from '~/design'

const ProductEntry = ({ product }) => {
    // a ref to track mouse drag
    const ref = useRef()

    // if we are dragging the mouse
    const drag = useMouseDrag(ref)

    return (
        <>
            <div
                ref={ref}
                {...css({
                    display: 'flex',
                    flexDirection: 'row',
                    padding: 10,
                    alignItems: 'center',
                    cursor: 'move',
                    userSelect: 'none',
                })}
                {...hover({
                    backgroundColor: lightGrey,
                })}
            >
                <Product progress={1} {...css({ marginRight: 10 })} />
                <div {...css({})}>{product.name}</div>
            </div>
            {drag && (
                <Product
                    progress={1}
                    style={{
                        position: 'fixed',
                        top: drag.currentLocation.y,
                        left: drag.currentLocation.x,
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
        }
    `
)
