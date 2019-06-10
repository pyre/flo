// external imports
import React, { useRef, useEffect, useContext } from 'react'
import { graphql, createFragmentContainer } from 'react-relay'
import SvgMatrix from 'svg-matrix'
import { css } from 'glamor'
// local imports
import { Query } from '~/components'
import _Flo from './Flo'
import { Diagram as DiagramContext } from '~/context'
import { useKeyPress, useMouseDrag, useEvent, useSubscription } from '~/hooks'
import Grid from './Grid'
import Toolbar from './Toolbar'

export const Flo = _Flo

const Diagram = () => {
    // we need a ref to track interactions with the diagram
    const diagramElement = useRef(null)

    // enable the mousewheel zoom behavior
    // useZoomBehavior(diagram)
    // and the drag behavior
    useDragBehavior(diagramElement)

    // grab the info and actions we need from the diagram
    const { diagram } = useContext(DiagramContext)

    // compute the transform string for the diagram
    const { transformString } = SvgMatrix()
        .translate(diagram.pan.x, diagram.pan.y)
        .scale(diagram.zoomLevel)

    return (
        // we want to wrap the diagram in a div so we can easily position the tools over it
        <div
            {...css({
                display: 'flex',
                flexGrow: 1,
                cursor: 'default',
                zIndex: 1,
                position: 'relative',
            })}
        >
            <svg {...css({ width: '100%', height: '100%' })} ref={diagramElement}>
                <g transform={transformString}>
                    <Grid />
                    {/* make sure the diagram sits above the grid */}
                    <Query query={floQuery} variables={{ id: 'RmxvOjA=' }} loadingState={null}>
                        {({ node }) => <CenteredFlo producer={node} />}
                    </Query>
                </g>
            </svg>
            <Toolbar />
        </div>
    )
}

// the query for the flo we're looking at
const floQuery = graphql`
    query DiagramQuery($id: ID!) {
        node(id: $id) {
            ...DiagramCenteredFlo_producer
        }
    }
`

const subscription = graphql`
    subscription DiagramSubscription($flo: ID!) {
        node(id: $flo) {
            ...Flo_producer
        }
    }
`

// this component takes the elements in the flo and centers the diagram before mounting
const CenteredFlo = createFragmentContainer(
    ({ producer }) => {
        // grab a reference to the diagram context
        const { pan } = useContext(DiagramContext)

        // compute the upper left region of the diagram
        const originY = producer.products.reduce((acc, product) => Math.min(product.position.y, acc), Infinity)
        const originX = producer.products.reduce((acc, product) => Math.min(product.position.x, acc), Infinity)

        // when this hook mounts
        useEffect(() => {
            // apply the correct transformation to position the top left point
            // at 150,150
            pan({
                x: -originX + 150,
                y: -originY + 100,
            })
        }, [])

        useSubscription(subscription, {
            flo: producer.id,
        })

        // visualize the flo
        return <Flo producer={producer} />
    },
    graphql`
        fragment DiagramCenteredFlo_producer on Flo {
            ... on Flo {
                id
                products {
                    position {
                        x
                        y
                    }
                }
                ...Flo_producer
            }
        }
    `
)

const useDragBehavior = elementRef => {
    const { pan } = useContext(DiagramContext)
    // we care if the space bar is pressed
    const spacePressed = useKeyPress(' ')

    // track the movement of the mouse
    const mouseDrag = useMouseDrag(elementRef, [spacePressed])

    // the keyboard interactions have all sorts of effects
    useEffect(() => {
        // if the space bar is pressed and the mouse is being moved
        if (spacePressed && mouseDrag) {
            // pan the diagram
            pan(mouseDrag.delta)
        }
    }, [spacePressed, mouseDrag && mouseDrag.delta.x, mouseDrag && mouseDrag.delta.y])

    // this hook returns wether or not to show the selection rectangle while dragging
    return (
        mouseDrag &&
        !spacePressed && {
            point1: mouseDrag.origin,
            point2: mouseDrag.currentLocation,
        }
    )
}

export default Diagram
