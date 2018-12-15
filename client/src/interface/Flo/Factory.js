// external imports
import React, { useContext } from 'react'
import { createFragmentContainer, graphql } from 'react-relay'
// local imports
import {
    elementOutline,
    factoryPrimary,
    selectedBorderWidth,
    selectedBorderGap,
    background,
    factorySelectedBorder,
} from '~/design'
import { DiagramContext } from '~/state'

/*
    Every factory component is responsible for rendering the following visual entities:
    - The diamond at the center
        - when clicked, focuses the inspector on that element
        - when hovered, shows a tooltip with descriptive information on the factory
        - the optional input and output squares (with a line joining them)
        - render the lines linking the input square with to the inputs themselves
        - render the lines linking the output square to the outputs themselves
*/

// the primary length for the central daimond
const diamondLength = 12
// the primary length for the squares that define the in and out point
const squareLength = 3

// the distance from the central diamond to the square
const armLength = 50

const Factory = ({
    factory: {
        position: { x, y },
        ...factory
    },
}) => {
    // the location of the left square
    const leftSquareLocation = {
        x: x - armLength,
        y: y,
    }
    // the location of the right square
    const rightSquareLocation = {
        x: x + armLength,
        y: y,
    }

    // the locations for the 4 points of the rectangle
    const leftPoint = {
        x: x - diamondLength,
        y,
    }
    const topPoint = {
        x,
        y: y - diamondLength,
    }
    const rightPoint = {
        x: x + diamondLength,
        y,
    }
    const bottomPoint = {
        y: y + diamondLength,
        x,
    }

    // grab the diagram state
    const { diagram, selectElements } = useContext(DiagramContext)

    // pull out the selected element
    const [id] = diagram.selectedElements

    return (
        <>
            // there is a line going from one square to the other
            <line stroke={elementOutline} strokeWidth={1} x1={x + armLength} y1={y} y2={y} x2={x - armLength} />
            // render the lines joining the left square to each of the inputs
            {factory.inputs.map((binding, i) => (
                <React.Fragment key={binding.id}>
                    <line
                        id={binding.id}
                        x1={leftSquareLocation.x}
                        y1={leftSquareLocation.y}
                        x2={leftSquareLocation.x}
                        y2={binding.product.position.y}
                        stroke={elementOutline}
                        strokeWidth={1}
                    />
                    <line
                        id={binding.id}
                        x1={leftSquareLocation.x}
                        y1={binding.product.position.y}
                        x2={binding.product.position.x}
                        y2={binding.product.position.y}
                        stroke={elementOutline}
                        strokeWidth={1}
                    />
                </React.Fragment>
            ))}
            // render the lines joining the right square to each of its results
            {factory.outputs.map(result => (
                <React.Fragment key={result.id}>
                    <line
                        id={result.id}
                        x1={rightSquareLocation.x}
                        y1={rightSquareLocation.y}
                        x2={rightSquareLocation.x}
                        y2={result.product.position.y}
                        stroke={elementOutline}
                        strokeWidth={1}
                    />
                    <line
                        id={result.id}
                        x1={rightSquareLocation.x}
                        y1={result.product.position.y}
                        x2={result.product.position.x}
                        y2={result.product.position.y}
                        stroke={elementOutline}
                        strokeWidth={1}
                    />
                </React.Fragment>
            ))}
            // only show the input rectangle if there is more than one product
            {(factory.inputs.length !== 1 ||
                // or there is only one product */
                (factory.inputs[0].product &&
                    // and that product is on the same x coordinate
                    factory.inputs[0].product.position.y !== y)) && (
                <rect
                    fill={elementOutline}
                    x={leftSquareLocation.x - squareLength}
                    y={leftSquareLocation.y - squareLength}
                    width={2 * squareLength}
                    height={2 * squareLength}
                />
            )}
            // only show the output rectangle if there is more than one result
            {(factory.outputs.length !== 1 ||
                // or there is only one product
                (factory.outputs[0].product &&
                    // and that product is on the same x coordinate
                    factory.outputs[0].product.position.y !== y)) && (
                <rect
                    fill={elementOutline}
                    x={rightSquareLocation.x - squareLength}
                    y={rightSquareLocation.y - squareLength}
                    width={2 * squareLength}
                    height={2 * squareLength}
                />
            )}
            // if the factory is selected
            {factory.id === id && (
                <>
                    // the outer highlight for selected factory indicator
                    <polygon
                        fill={factorySelectedBorder}
                        stroke={'none'}
                        strokeWidth={1}
                        points={`
                            ${leftPoint.x - selectedBorderGap - selectedBorderWidth},${leftPoint.y}
                            ${topPoint.x},${topPoint.y - selectedBorderGap - selectedBorderWidth}
                            ${rightPoint.x + selectedBorderGap + selectedBorderWidth}, ${rightPoint.y}
                            ${bottomPoint.x},${bottomPoint.y + selectedBorderGap + selectedBorderWidth}
                        `}
                    />
                    <polygon
                        fill={background}
                        stroke={'none'}
                        strokeWidth={1}
                        points={`
                            ${leftPoint.x - selectedBorderGap},${leftPoint.y}
                            ${topPoint.x},${topPoint.y - selectedBorderGap}
                            ${rightPoint.x + selectedBorderGap}, ${rightPoint.y}
                            ${bottomPoint.x},${bottomPoint.y + selectedBorderGap}
                        `}
                    />
                </>
            )}
            // the center of a factory is the diamond used as the target for clicks
            <polygon
                fill={factoryPrimary}
                stroke={'none'}
                strokeWidth={1}
                onClick={() => selectElements(factory.id)}
                points={`${leftPoint.x},${leftPoint.y} ${topPoint.x},${topPoint.y} ${rightPoint.x},${rightPoint.y} ${
                    bottomPoint.x
                },${bottomPoint.y}`}
            />
        </>
    )
}

export default createFragmentContainer(
    Factory,
    graphql`
        fragment Factory_factory on Factory {
            id
            position {
                x
                y
            }
            inputs {
                id
                product {
                    id
                    position {
                        x
                        y
                    }
                }
            }
            outputs {
                id
                product {
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
