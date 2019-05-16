// external imports
import React, { useContext } from 'react'
import { graphql, createFragmentContainer } from 'react-relay'
import { css } from 'glamor'
// local imports
import { Arc, Draggable, Product as ProductCircle, Portal } from '~/components'
import { background, connectorColor, productSelectedBorder, selectedBorderWidth, selectedBorderGap } from '~/design'
import { useSubscription, useBrowserSize } from '~/hooks'
import { Diagram, Environment, Interface } from '~/context'
import { mutate } from '~/utils'
import { Radius } from '~/components/Product'

// the radius of the inner circle
const gutter = 15

const Product = ({ product }) => {
    // grab the diagram selected state
    const { diagram } = useContext(Diagram)
    const environment = useContext(Environment)

    // make sure we update this component when the product moves
    useSubscription(
        graphql`
            subscription ProductSubscription($id: ID!) {
                node(id: $id) {
                    ... on Product {
                        progress
                        position {
                            x
                            y
                        }
                    }
                }
            }
        `,
        {
            id: product.id,
        }
    )

    return (
        <>
            <Draggable
                id={product.id}
                origin={product.position}
                onMove={position =>
                    mutate({
                        environment,
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
                <>
                    // render the outer circle
                    {do {
                        // render a full circle if there are both a source and at least one binding
                        if (product.source && product.bindings.length > 0) {
                            ;<circle
                                fill={connectorColor}
                                cx={product.position.x}
                                cy={product.position.y}
                                r={gutter + 1}
                            />
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
                                stroke={connectorColor}
                            />
                        }
                        // there are only bindings
                        else if (product.bindings.length > 0) {
                            // so render the arc tha leaves the gap on the left
                            ;<Arc
                                r={gutter + 1}
                                x={product.position.x}
                                y={product.position.y}
                                theta1={-40}
                                theta2={230}
                                stroke={connectorColor}
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
                </>
            </Draggable>
            {diagram.showTooltips && <Tooltip product={product} x={product.position.x} y={product.position.y - 50} />}
        </>
    )
}

const Tooltip = ({ product, ...props }) => {
    // we need to know the current translation on the diagram to follow it
    const { diagram } = useContext(Diagram)

    // we need to render the portal outside of the immediate dom tree so we can render HTML
    // without the annoyance of embedding the element in a foreignObject (and have to have a definite width)
    return (
        <Portal id={`tooltip-${product.id}`}>
            <div
                {...css({
                    position: 'fixed',
                    zIndex: 10,
                    transform: 'translate(-50%, -50%)',
                    height: 50,
                    backgroundColor: 'white',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    padding: 12,
                    borderRadius: 3,
                    boxShadow:
                        '0 3px 20px 0 rgba(0,0,0,0.05), 0 2px 4px 0 rgba(0,0,0,0.20), 0 0 1px 0 rgba(0,0,1,0.10)',
                })}
                style={{
                    top: product.position.y - 50 + diagram.pan.y,
                    left: product.position.x + diagram.pan.x,
                }}
            >
                <ProductCircle
                    progress={product.progress}
                    {...css({
                        marginRight: 8,
                    })}
                />
                <div
                    {...css({
                        display: 'flex',
                        flexDirection: 'column',
                    })}
                >
                    <div>{product.name}</div>
                    <div>{product.description}</div>
                </div>
            </div>
        </Portal>
    )
}

export default createFragmentContainer(
    Product,
    graphql`
        fragment Product_product on Product {
            id
            progress
            name
            description
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
