// external imports
import React, { useContext } from 'react'
import { graphql, createFragmentContainer } from 'react-relay'
import { css } from 'glamor'
// local imports
import { Draggable, Product as ProductCircle, Portal, Ellipsis } from '~/components'
import { background, productSelectedBorder, selectedBorderWidth, selectedBorderGap } from '~/design'
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
            subscription Product2DSubscription($id: ID!) {
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

    if (diagram.selectedElements.includes(product.id)) {
        console.log(product.source && product.source.id)
    }
    return (
        <>
            <Draggable
                id={product.id}
                origin={product.position}
                onMove={position =>
                    mutate({
                        environment,
                        query: graphql`
                            mutation Product2DMoveProductMutation($input: MoveProductInput!) {
                                moveProduct(input: $input) {
                                    product {
                                        id
                                        position {
                                            x
                                            y
                                        }
                                        bindings {
                                            id
                                            position {
                                                x
                                                y
                                            }
                                        }
                                        source {
                                            id
                                            position {
                                                x
                                                y
                                            }
                                        }
                                    }
                                }
                            }
                        `,
                        variables: { input: { product: product.id, ...position } },
                        optimisticResponse: {
                            moveProduct: {
                                product: {
                                    id: product.id,
                                    position,
                                    bindings: product.bindings.map(({ id }) => ({
                                        id,
                                        position,
                                    })),
                                    source: product.source && {
                                        id: product.source.id,
                                        position,
                                    },
                                },
                            },
                        },
                    })
                }
            >
                <>
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
                    <ProductCircle
                        flip={true}
                        x={product.position.x}
                        y={product.position.y}
                        progress={product.progress}
                    />
                </>
            </Draggable>
            {diagram.showTooltips && <Tooltip product={product} x={product.position.x} y={product.position.y - 50} />}
        </>
    )
}

const Tooltip = ({ product, ...props }) => {
    // we need to know the current translation on the diagram to follow it
    const { diagram } = useContext(Diagram)
    const { colors, shadows } = useContext(Interface)
    const { height } = useBrowserSize()

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
                    boxShadow: shadows[0],
                    width: 250,
                })}
                style={{
                    top: height - (product.position.y + 50 + diagram.pan.y),
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
                        flexGrow: 1,
                        width: 10,
                    })}
                >
                    <Ellipsis
                        {...css({
                            fontSize: 14,
                        })}
                    >
                        {product.name}
                    </Ellipsis>
                    <Ellipsis
                        {...css({
                            color: colors.darkGrey,
                            fontSize: 12,
                            lineHeight: 1,
                        })}
                    >
                        {product.description}
                    </Ellipsis>
                </div>
            </div>
        </Portal>
    )
}

export default createFragmentContainer(
    Product,
    graphql`
        fragment Product2D_product on Product {
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
