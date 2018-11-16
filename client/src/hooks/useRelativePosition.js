// external imports
import { useContext } from 'react'
// local imports
import { DiagramContext } from '~/state'

// this hook takes a relative location and returns a live version of it that accomodates pan and zoom
export default location => {
    // if we are passed null
    if (!location) {
        // it stays null
        return location
    }
    const { diagram } = useContext(DiagramContext)

    // for now, just incorporate the sidebar
    return {
        x: (location.x - diagram.pan.x) / diagram.zoomLevel,
        y: (location.y - diagram.pan.y) / diagram.zoomLevel,
    }
}
