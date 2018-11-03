// external imports
import React from 'react'
import { render, fireEvent, cleanup } from 'react-testing-library'
import 'jest-dom/extend-expect'
// local imports
import { DiagramProvider, DiagramContext } from '..'

afterEach(cleanup)

test('can zoom in and out but not passed bounds', () => {
    // the parameters of the zoom
    const maxZoom = 1.5
    const minZoom = 0.5
    const zoomStep = 0.1
    const zoomLevel = 1

    // the component to exercise zoom tests
    const component = (
        <DiagramProvider
            maxZoom={maxZoom}
            minZoom={minZoom}
            zoomStep={zoomStep}
            zoomLevel={zoomLevel}
        >
            <DiagramContext.Consumer>
                {({ diagram, zoomIn, zoomOut }) => (
                    <React.Fragment>
                        <div onClick={zoomIn} data-testid="zoom-in" />
                        <div onClick={zoomOut} data-testid="zoom-out" />
                        <div data-testid="zoom-level">{diagram.zoomLevel}</div>
                    </React.Fragment>
                )}
            </DiagramContext.Consumer>
        </DiagramProvider>
    )

    // render the component
    const { getByTestId } = render(component)

    // get the current state of the zoom level
    const currentZoom = getByTestId('zoom-level')
    const zoomInButton = getByTestId('zoom-in')
    const zoomOutButton = getByTestId('zoom-out')

    // the number of steps from initial zoom to max zoom
    const maxSteps = parseInt((maxZoom - zoomLevel) / zoomStep)

    // make sure we started at the designated level
    expect(parseFloat(currentZoom.textContent)).toEqual(zoomLevel)

    // increase it past the max zoom
    for (let i = 0; i < maxSteps + 10; i++) {
        fireEvent.click(zoomInButton)
    }

    // make sure we are at the maximum zoom
    expect(parseFloat(currentZoom.textContent)).toEqual(maxZoom)

    // the distance between the max and min zoom (to test the lower bounds)
    const rangeSteps = parseInt((maxZoom - minZoom) / zoomStep)

    // decrease it past the min zoom
    for (let i = 0; i < rangeSteps + 10; i++) {
        fireEvent.click(zoomOutButton)
    }

    // make sure we are the minimum zoom
    expect(parseFloat(currentZoom.textContent)).toEqual(minZoom)
})

// test('can pan the diagram')

// test('can toggle the grid')

// test('can set the grid size')
