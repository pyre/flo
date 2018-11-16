// external imports
import { useState, useEffect } from 'react'

export default (event, handler, trackers = []) => {
    // create an effect to track the event
    useEffect(() => {
        // pass the listener
        window.addEventListener(event, handler)

        // when we have to clean up
        return () => {
            // clear the listener
            window.removeEventListener(event, handler)
        }
    }, trackers)
}
