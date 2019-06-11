// external imports
import { useEffect, useState, useContext } from 'react'
// local imports
import { useEvent } from '.'
import { Diagram } from '~/context'
import { useBrowserSize } from '~/hooks'

export default (targetElement, trackers = []) => {
    const [state, setState] = useState({
        init: false,
        origin: null,
        currentLocation: {},
        delta: { x: 0, y: 0 },
    })

    const { height } = useBrowserSize()

    // when the mouse is pressed
    function downHandler({ target, clientX, clientY }) {
        const location = {
            x: clientX,
            y: height - clientY,
        }
        // if there is a target element
        if (targetElement && targetElement.current) {
            // only set the state if the clicked element is a child of the one we were given
            if (targetElement.current.contains(target)) {
                // the new state
                setState({
                    origin: location,
                    currentLocation: location,
                    delta: { x: 0, y: 0 },
                    init: true,
                })
            }
        }
    }

    // when the mouse is released
    const upHandler = () => {
        // if the mouse was previously down
        if (state.origin) {
            // toggle it
            setState(state => ({
                ...state,
                delta: { x: 0, y: 0 },
                origin: false,
                currentLocation: false,
                init: false,
            }))
        }
    }

    // a function to call to keep our state up to date
    const moveHandler = evt => {
        // if the mouse was down
        if (state.origin) {
            // the location where the mouse was last known
            const location = {
                x: evt.clientX,
                y: height - evt.clientY,
            }

            // update the drag state
            setState(state => ({
                ...state,
                delta: {
                    x: location.x - state.currentLocation.x,
                    y: location.y - state.currentLocation.y,
                },
                currentLocation: location,
            }))
        }
    }

    // invoke the handler when the mouse moves
    useEvent('mousemove', moveHandler, [state.init, state.currentLocation.x, state.currentLocation.y, ...trackers])

    // add event listeners
    useEvent('mousedown', downHandler, [state.init, targetElement])
    useEvent('mouseup', upHandler, [state.init, targetElement])

    // return the delta to the caller
    return state.init && state
}
