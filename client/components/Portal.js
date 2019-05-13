// external imports
import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'

export default function Portal({ children, as = 'div', id, ...props }) {
    // the id of the portal
    const portalID = id ? `portal-${id}` : 'portal'

    // a reference to the element we created
    const [elementRef, setElement] = useState(null)

    // when this component mounts we need to create the element we are
    // going to use for the portal
    useEffect(
        () => {
            console.log('starting')
            // look for an element with the designated id
            let element = document.getElementById(portalID)
            // the style to apply to the portal container
            let elementStyle = props.style || {}

            // if the element doesn't exist
            if (!element) {
                // create a new element
                element = document.createElement(as)
                // make sure there's only one
                element.id = portalID
                // append the element to the DOM
                document.getElementsByTagName('body')[0].appendChild(element)
            }

            // apply any styles
            Object.keys(elementStyle).forEach(style => element && element.style.setProperty(style, elementStyle[style]))

            // save the reference to the element
            setElement(element)

            // when we need to clean up
            return () => {
                // if we have an element we created
                if (element) {
                    console.log('deleteing portals')
                    // delete the element from the dom
                    element.parentNode.removeChild(element)
                }
            }
        },
        // only run this effect once
        []
    )

    return elementRef && ReactDOM.createPortal(children, elementRef)
}
