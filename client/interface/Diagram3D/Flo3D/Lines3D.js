// external imports
import React, { useContext } from 'react'
import { createFragmentContainer, graphql } from 'react-relay'
import { useHex } from '@react-vertex/color-hooks'
import { useBasicSolid } from '@react-vertex/material-hooks'
import { useVector3 } from '@react-vertex/math-hooks'
import { useBoxElements } from '@react-vertex/geometry-hooks'
// local imports
import { Interface } from '~/context'

// lines in 3d are represented by rectangular pipes
const tubeWidth = 0.1
const boxWidth = 3 * tubeWidth

const Lines3D = ({ producer }) => (
    <>
        {(producer.factories || []).map(factory => {
            //  for each factory we have to show
            //      a connector square on either side
            //      the lines coming in and out

            // the location of the right connector square
            const rightSquareLocation = {
                y: factory.position.y,
                x: factory.position.x + 50,
            }

            // the location of the left connector square
            const leftSquareLocation = {
                y: factory.position.y,
                x: factory.position.x - 50,
            }

            return (
                <React.Fragment key={factory.id}>
                    {/* a line connecting the two squares */}
                    <Tube p1={leftSquareLocation} p2={rightSquareLocation} />

                    {/* only show the box is there is more than one input */}
                    {factory.inputs.length > 1 && <Box position={leftSquareLocation} />}

                    {/* only show the box is there is more than one output */}
                    {factory.outputs.length > 1 && <Box position={rightSquareLocation} />}

                    {/* for each output we have to render the tube from the connection square to the product */}
                    {factory.outputs.map(({ id, product }) => (
                        <React.Fragment key={id}>
                            {/* a horizontal line from the vertical line the product */}
                            <Tube
                                p1={{
                                    x: rightSquareLocation.x,
                                    y: product.position.y,
                                }}
                                p2={product.position}
                            />
                            {/* a vertical line from the square to the horizontal line */}
                            <Tube
                                p1={rightSquareLocation}
                                p2={{
                                    x: rightSquareLocation.x,
                                    y: product.position.y,
                                }}
                            />
                        </React.Fragment>
                    ))}

                    {/* for each input we have to render the tube from the connection square to the product */}
                    {factory.inputs.map(({ id, product }) => (
                        <React.Fragment key={id}>
                            {/* a horizontal line from the vertical line the product */}
                            <Tube
                                p1={{
                                    x: leftSquareLocation.x,
                                    y: product.position.y,
                                }}
                                p2={product.position}
                            />
                            {/* a vertical line from the square to the horizontal line */}
                            <Tube
                                p1={leftSquareLocation}
                                p2={{
                                    x: leftSquareLocation.x,
                                    y: product.position.y,
                                }}
                            />
                        </React.Fragment>
                    ))}
                </React.Fragment>
            )
        })}
    </>
)

// a tube from p1 to p2
const Tube = ({ p1, p2 }) => {
    // get the current theme
    const {
        colors: { connectorColor },
    } = useContext(Interface)

    // the with is the distance between the two points
    const deltaX = p1.x - p2.x
    const deltaY = p1.y - p2.y
    const width = Math.sqrt(deltaX ** 2 + deltaY ** 2) / 25
    // we reprsent a factory as a diamond in 3d implemented as a rotated cube
    const element = useBoxElements(width, tubeWidth, tubeWidth)

    // the position of the line is the center of the two points
    const center = useVector3((p1.x + p2.x) / 2 / 25, (p1.y + p2.y) / 2 / 25, 0)

    // we have to rotate the line
    const rotation = useVector3(0, 0, Math.atan2(deltaY, deltaX))

    return (
        <material program={useBasicSolid(useHex(connectorColor, true), 0.15)}>
            <geometry {...element} rotation={rotation} position={center} />
        </material>
    )
}

const Box = ({ position }) => {
    // get the current theme
    const {
        colors: { connectorColor },
    } = useContext(Interface)

    // we reprsent a factory as a diamond in 3d implemented as a rotated cube
    const element = useBoxElements(boxWidth, boxWidth, boxWidth)
    const boxPosition = useVector3(position.x / 25, position.y / 25, 0)

    return (
        <material program={useBasicSolid(useHex(connectorColor, true), 0.15)}>
            <geometry {...element} position={boxPosition} />
        </material>
    )
}

export default createFragmentContainer(
    Lines3D,
    graphql`
        fragment Lines3D_producer on Producer {
            factories {
                id
                position {
                    x
                    y
                }
                outputs {
                    id
                    position {
                        x
                        y
                    }
                }
                inputs {
                    id
                    position {
                        x
                        y
                    }
                }
            }
        }
    `
)
