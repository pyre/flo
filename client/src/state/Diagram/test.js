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
    const { getByTestId } = render(
        <DiagramProvider maxZoom={maxZoom} minZoom={minZoom} zoomStep={zoomStep} zoomLevel={zoomLevel}>
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

test('can pan the diagram', () => {
    // the component to exercise pan tests
    const { getByTestId } = render(
        <DiagramProvider>
            <DiagramContext.Consumer>
                {({ diagram, pan }) => (
                    <React.Fragment>
                        <div onClick={() => pan({ x: 10, y: 10 })} data-testid="pan" />
                        <div data-testid="current-pan">
                            {diagram.pan.x},{diagram.pan.y}
                        </div>
                    </React.Fragment>
                )}
            </DiagramContext.Consumer>
        </DiagramProvider>
    )

    // get the element with the current pan
    const currentPan = getByTestId('current-pan')

    // make sure the current pan matches expectations
    expect(currentPan).toHaveTextContent('0,0')

    // pan the diagram
    fireEvent.click(getByTestId('pan'))

    // make sure we updated the diagram state
    expect(currentPan).toHaveTextContent('10,10')
})

test('can toggle the grid', () => {
    // render the component
    const { getByTestId } = render(
        <DiagramProvider>
            <DiagramContext.Consumer>
                {({ diagram, toggleGrid }) => (
                    <React.Fragment>
                        <div onClick={toggleGrid} data-testid="toggle" />
                        <div data-testid="current">{diagram.showGrid ? 'yes' : 'no'}</div>
                    </React.Fragment>
                )}
            </DiagramContext.Consumer>
        </DiagramProvider>
    )

    // the elements to test
    const toggle = getByTestId('toggle')
    const state = getByTestId('current')

    // the initial state
    const initialState = state.textContent === 'yes'

    // call the toggle
    fireEvent.click(toggle)

    // make sure we inverted the state
    expect(state.textContent === 'yes').toEqual(!initialState)
})

test('can set the grid size', () => {
    // render the component
    const { getByTestId } = render(
        <DiagramProvider gridSize={5}>
            <DiagramContext.Consumer>
                {({ diagram, setGridSize }) => (
                    <React.Fragment>
                        <div onClick={() => setGridSize(10)} data-testid="set-size" />
                        <div data-testid="current">{diagram.gridSize}</div>
                    </React.Fragment>
                )}
            </DiagramContext.Consumer>
        </DiagramProvider>
    )

    // the elements to use in tests
    const setSize = getByTestId('set-size')
    const state = getByTestId('current')

    // make sure we followed the initial state
    expect(state.textContent).toEqual('5')

    // update the state
    fireEvent.click(setSize)

    // make sure we updated the state
    expect(state.textContent).toEqual('10')
})
