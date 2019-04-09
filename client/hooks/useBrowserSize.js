// external imports
import { useState, useEffect } from 'react'
// local imports
import { useEvent } from '.'

export default () => {
    // hold onto some state to track the browser width
    const [width, setWidth] = useState(window.innerWidth)
    const [height, setHeight] = useState(window.innerHeight)

    // our callback to update the width
    const updateWidth = () => {
        setWidth(window.innerWidth)
        setHeight(window.innerHeight)
    }

    // whenever the browser resizes, update the width
    useEvent('resize', updateWidth)

    // return the width to the caller
    return { width, height }
}
