import React, { createContext, useState } from 'react'

// a context for diagram state
export const DiagramContext = createContext()

// a provider with the specified state
export const DiagramProvider = ({
    maxZoom = 2,
    minZoom = 0.5,
    zoomStep = 0.1,
    children,
    ...initialState
}) => {
    // the initial state of the diagram
    const [diagram, setState] = useState({
        showGrid: true,
        gridSize: 50,
        pan: { x: 0, y: 0 },
        zoomLevel: 1,
        ...initialState,
    })

    // the ways to manipulate the diagram
    const actions = {
        toggleGrid() {
            setState(state => ({
                showGrid: !state.showGrid,
            }))
        },
        setGridSize(gridSize) {
            setState({ gridSize })
        },
        pan({ x = 0, y = 0 }) {
            setState(state => ({
                x: state.x + x,
                y: state.y + y,
            }))
        },
        setZoom(zoomLevel) {
            setState({ zoomLevel })
        },
        zoomIn() {
            setState(state => ({
                zoomLevel: Math.min(state.zoomLevel + zoomStep, maxZoom),
            }))
        },
        zoomOut() {
            setState(state => ({
                zoomLevel: Math.max(state.zoomLevel - zoomStep, minZoom),
            }))
        },
    }

    // return the children wrapped in a provider
    return (
        <DiagramContext.Provider value={{ diagram, ...actions }}>
            {children}
        </DiagramContext.Provider>
    )
}
