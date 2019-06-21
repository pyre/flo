// external imports
import React, { createContext, useState } from 'react'

// a context for diagram state
export const Diagram = createContext()

// a provider with the specified state
export const DiagramProvider = ({ maxZoom = 2, minZoom = 0.5, zoomStep = 0.1, children, ...initialState }) => {
    // the initial state of the diagram
    const [diagram, setState] = useState({
        showGrid: true,
        gridSize: 50,
        pan: { x: 0, y: 0 },
        selectedElements: [],
        showTooltips: false,
        zoomLevel: 1,
        view: '2D',
        unit: 50,
        floID: 'RmxvOjA=',
        ...initialState,
    })

    // the ways to manipulate the diagram
    const actions = {
        toggleGrid() {
            setState(state => ({
                ...state,
                showGrid: !state.showGrid,
            }))
        },
        toggleView() {
            setState(state => ({
                ...state,
                view: state.view === '2D' ? '3D' : '2D',
            }))
        },
        setGridSize(gridSize) {
            setState(state => ({
                ...state,
                gridSize,
            }))
        },
        pan({ x = 0, y = 0 }) {
            setState(state => ({
                ...state,
                pan: {
                    x: state.pan.x + x,
                    y: state.pan.y + y,
                },
            }))
        },
        setZoom(zoomLevel) {
            setState(state => ({
                ...state,
                zoomLevel,
            }))
        },
        selectElements(...elements) {
            setState(state => ({
                ...state,
                selectedElements: elements,
            }))
        },
        clearSelection() {
            setState(state => ({
                ...state,
                selectedElements: [],
            }))
        },
        toggleTooltips() {
            setState(state => ({
                ...state,
                showTooltips: !state.showTooltips,
            }))
        },
    }

    // return the children wrapped in a provider
    return <Diagram.Provider value={{ diagram, ...actions }}>{children}</Diagram.Provider>
}
