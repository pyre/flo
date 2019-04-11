// external imports
import { useEffect, useState } from 'react'
// local imports
import { useEvent } from '~/hooks'

export default targetElement => {
    // State for keeping track of whether mouse is pressed
    const [mouseDown, setMouseDown] = useState(null)

    // when the mouse is pressed
    function downHandler({ target, clientX, clientY }) {
        // if there is a target element
        if (targetElement) {
            // only set the state if the clicked element is a child of the one we were given
            if (targetElement.contains(target)) {
                setMouseDown({
                    x: clientX,
                    y: clientY,
                })
            }
        }
        // if there isn't a target element
        else {
            // then we care about global state so set it to tru
            setMouseDown({
                x: clientX,
                y: clientY,
            })
        }
    }

    // when the mouse is released
    const upHandler = () => {
        // if the mouse was previously down
        if (mouseDown) {
            // toggle it
            setMouseDown(false)
        }
    }

    // add event listeners
    useEvent('mousedown', downHandler, [targetElement, mouseDown])
    useEvent('mouseup', upHandler, [targetElement, mouseDown])

    // return the location where the mouse went down
    return mouseDown
}
