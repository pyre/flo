// external imports
import { useContext } from 'react'
// local imports
import { Diagram } from '~/context'
import { round } from '~/utils'

// this hook normalizes a given delta by the grid size. If the grid size is 50, and the delta is 25
// this hook returns .5 (half of a grid)
export default delta => {
    // pull the diagram information
    const { diagram } = useContext(Diagram)

    // if there is no grid size
    if (diagram.gridSize === 0) {
        // then we have moved infinite more than the grid size
        return Infinity
    }

    // convert the grid size into viewport coordinates
    const zoomGridSize = diagram.gridSize * diagram.zoomLevel

    // return the amount we've moved normalized by the grid
    return delta / zoomGridSize
}
