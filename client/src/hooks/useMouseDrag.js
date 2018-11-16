// external imports
import { useEffect, useState } from 'react'
// local imports
import { useEvent } from '.'

export default (targetElement, trackers = []) => {
    const [state, setState] = useState({
        init: false,
        origin: null,
        lastLocation: {},
        delta: { x: 0, y: 0 },
    })

    // when the mouse is pressed
    function downHandler({ target, clientX, clientY }) {
        const location = {
            x: clientX,
            y: clientY,
        }
        // the new state
        const newState = {
            origin: location,
            lastLocation: location,
            delta: { x: 0, y: 0 },
        }

        // if there is a target element
        if (targetElement) {
            // only set the state if the clicked element is a child of the one we were given
            if (targetElement.contains(target)) {
                setState(newState)
            }
        }
        // if there isn't a target element
        else {
            // then we care about global state so set it to tru
            setState(newState)
        }
    }

    // when the mouse is released
    const upHandler = () => {
        // if the mouse was previously down
        if (state.origin) {
            // toggle it
            setState(state => ({
                delta: { x: 0, y: 0 },
                origin: false,
                lastLocation: false,
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
                y: evt.clientY,
            }
            console.log('delta', {
                x: state.lastLocation.x - location.x,
                y: state.lastLocation.y - location.y,
            })
            setState(state => ({
                ...state,
                delta: {
                    x: state.lastLocation.x - location.x,
                    y: state.lastLocation.y - location.y,
                },
                lastLocation: location,
            }))
        }
    }

    // invoke the handler when the mouse moves
    useEvent('mousemove', moveHandler, [
        state.origin.x,
        state.origin.y,
        state.lastLocation.x,
        state.lastLocation.y,
        ...trackers,
    ])
    // add event listeners
    useEvent('mousedown', downHandler, [targetElement])
    useEvent('mouseup', upHandler, [state.origin, targetElement])

    // return the delta to the caller
    return state.origin.x && state
}
