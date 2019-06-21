// external imports
import React, { useContext } from 'react'
// local imports
import { Diagram } from '~/context'
import { useBrowserSize } from '~/hooks'
import { range, round } from '~/utils'
import styles from './styles'
import { background } from '~/design'

const Grid = ({ style }) => {
    // get the size of the browser
    const browser = useBrowserSize()
    // and the current state of the diagram
    const { diagram, clearSelection } = useContext(Diagram)

    // the number of vertical grid lines (plus one to cover the remainder)
    const nVertical = (Math.floor(browser.width / diagram.gridSize) + 1) / diagram.zoomLevel
    // the number of horizontal lines (add one to cover the remainder)
    const nHorizontal = (Math.floor(browser.height / diagram.gridSize) + 1) / diagram.zoomLevel

    // the 4 dimansions that define the bounds of the grid
    const topEdge = (browser.height + diagram.gridSize - diagram.pan.y) / diagram.zoomLevel
    const bottomEdge = (-diagram.gridSize - diagram.pan.y) / diagram.zoomLevel
    const leftEdge = (-diagram.gridSize - diagram.pan.x) / diagram.zoomLevel
    const rightEdge = (browser.width + diagram.gridSize - diagram.pan.x) / diagram.zoomLevel

    // render the grid
    return (
        <g {...{ ...styles.container, ...style }} onClick={clearSelection}>
            <rect x={leftEdge} y={bottomEdge} width={browser.width} height={browser.height + 100} fill={background} />
            {range(nVertical + 4).map(i => {
                // the shared x coordinate of the vertical lines
                const x = round(leftEdge + i * diagram.gridSize, diagram.gridSize)
                // render the line
                return (
                    <path
                        {...styles.gridLine}
                        key={`${x} ${bottomEdge} - ${i}`}
                        d={`M ${x} ${bottomEdge} L ${x} ${topEdge}`}
                    />
                )
            })}
            {range(nHorizontal + 4).map(i => {
                // the shared y coordinate of the horizontal lines
                const y = round(bottomEdge + i * diagram.gridSize, diagram.gridSize)
                // render the line
                return (
                    <path
                        {...styles.gridLine}
                        key={`${leftEdge} ${y} - ${i}`}
                        d={`M ${leftEdge} ${y}  L ${rightEdge} ${y} `}
                    />
                )
            })}
        </g>
    )
}

export default Grid
