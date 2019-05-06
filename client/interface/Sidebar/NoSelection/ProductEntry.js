// external imports
import React, { useRef } from 'react'
import { graphql, createFragmentContainer } from 'react-relay'
import { css, hover } from 'glamor'
// local imports
import { Product } from '~/components'
import { useMouseDrag } from '~/hooks'
import { lightGrey, darkGrey } from '~/design'

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
                    paddingLeft: 10,
                    paddingRight: 10,
                    paddingTop: 7,
                    paddingBottom: 7,
                    alignItems: 'center',
                    cursor: 'move',
                    userSelect: 'none',
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
            description
        }
    `
)
