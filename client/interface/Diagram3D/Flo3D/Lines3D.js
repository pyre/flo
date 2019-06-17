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

    // since the position of a the box element is its center, we need to translate it over a bit
    const position = useVector3(p1.x / 25 + width / 2, p1.y / 25, 0)

    console.log(p1, p2, center, position)

    // we have to rotate the line
    const rotation = useVector3(0, 0, Math.atan2(deltaY, deltaX))

    return (
        <material program={useBasicSolid(useHex(connectorColor, true), 0.15)}>
            <geometry {...element} rotation={rotation} position={center} />
        </material>
    )
}

const Lines3D = ({ producer }) => (
    <>
        {(producer.factories || []).map(factory => (
            <React.Fragment key={factory.id}>
                {factory.outputs.map(({ id, product }) => (
                    // a horizontal line from
                    <Tube key={id} p1={factory.position} p2={product.position} />
                ))}
            </React.Fragment>
        ))}
    </>
)

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
                    product {
                        position {
                            x
                            y
                        }
                    }
                }
                inputs {
                    product {
                        position {
                            x
                            y
                        }
                    }
                }
            }
        }
    `
)
