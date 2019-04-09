// external imports
import { useEffect, useState } from 'react'
// local imports
import { useEvent } from '~/hooks'

export default targetKey => {
    // State for keeping track of whether key is pressed
    const [keyPressed, setKeyPressed] = useState(false)

    // if a key is pressed
    function downHandler({ key }) {
        // and its the key we care about
        if (key === targetKey) {
            setKeyPressed(true)
        }
    }

    // the function to call if a key goes up
    const upHandler = ({ key }) => {
        if (key === targetKey) {
            setKeyPressed(false)
        }
    }

    // add the event listeners
    useEvent('keydown', downHandler)
    useEvent('keyup', upHandler)

    return keyPressed
}
