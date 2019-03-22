// external imports
import React, { useContext } from 'react'
import { graphql, createFragmentContainer } from 'react-relay'
// local imports
import { Arc, Draggable, Product as ProductCircle } from '~/components'
import { background, elementOutline, productSelectedBorder, selectedBorderWidth, selectedBorderGap } from '~/design'
import { DiagramContext } from '~/state'
import { mutate } from '~/utils'
import { Radius } from '~/components/Product'

// the radius of the inner circle
const gutter = 15

const Product = ({ product }) => {
    // grab the diagram selected state
    const { diagram, selectElements } = useContext(DiagramContext)

    return (
        <Draggable
            id={product.id}
            origin={product.position}
            onMove={position =>
                mutate({
                    query: graphql`
                        mutation ProductMoveProductMutation($product: ID!, $x: Int!, $y: Int!) {
                            moveProduct(product: $product, x: $x, y: $y) {
                                product {
                                    id
                                    position {
                                        x
                                        y
                                    }
                                }
                            }
                        }
                    `,
                    variables: { product: product.id, ...position },
                    optimisticResponse: {
                        moveProduct: {
                            product: {
                                id: product.id,
                                position,
                            },
                        },
                    },
                })
            }
        >
            <g onClick={() => selectElements(product.id)} style={{ cursor: 'pointer' }}>
                // render the outer circle
                {do {
                    // render a full circle if there are both a source and at least one binding
                    if (product.source && product.bindings.length > 0) {
                        ;<circle fill={elementOutline} cx={product.position.x} cy={product.position.y} r={gutter + 1} />
                    }
                    // if there is no source, then there is only bindings
                    else if (product.source) {
                        // so render the arc that leaves the gap on the right
                        ;<Arc
                            r={gutter + 1}
                            x={product.position.x}
                            y={product.position.y}
                            theta1={-230}
                            theta2={40}
                            stroke={elementOutline}
                        />
                    }
                    // there are only bindings
                    else {
                        // so render the arc tha leaves the gap on the left
                        ;<Arc
                            r={gutter + 1}
                            x={product.position.x}
                            y={product.position.y}
                            theta1={-40}
                            theta2={230}
                            stroke={elementOutline}
                        />
                    }
                }}
                // render some space between the fillter and the border
                <circle fill={background} cx={product.position.x} cy={product.position.y} r={gutter} />
                // if this element is selected we should show a visual indicator
                {diagram.selectedElements.includes(product.id) && (
                    <>
                        <circle
                            fill={productSelectedBorder}
                            cx={product.position.x}
                            cy={product.position.y}
                            r={Radius + selectedBorderWidth + selectedBorderGap}
                        />
                        <circle
                            fill={background}
                            cx={product.position.x}
                            cy={product.position.y}
                            r={Radius + selectedBorderGap}
                        />
                    </>
                )}
                <ProductCircle x={product.position.x} y={product.position.y} progress={product.progress} />
            </g>
        </Draggable>
    )
}

export default createFragmentContainer(
    Product,
    graphql`
        fragment Product_product on Product {
            id
            progress
            position {
                x
                y
            }
            source {
                id
            }
            bindings {
                id
            }
        }
    `
)
