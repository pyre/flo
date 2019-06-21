// external imports
import React, { useContext } from 'react'
import '@babel/polyfill'
import { css } from 'glamor'
import { hot } from 'react-hot-loader/root'
import { ReactRelayContext } from 'react-relay'
// local imports
import { DiagramProvider, EnvironmentProvider, InterfaceProvider, Diagram as DiagramCtx } from '~/context'
import { Diagram2D, Diagram3D, Sidebar, Toolbar } from '~/interface'

import './reset.css'

// the root of the application is pulled into a single file so that hot reloading
// only needs to wrap a single component

const App = () => {
    // look up which diagram to show
    const { diagram: { view } } = useContext(DiagramCtx)

    // get the appropriate diagram to show
    const Diagram = view === '3D' ? Diagram3D : Diagram2D

    return (
        <div
            {...css({
                display: 'flex',
                height: '100vh',
                width: '100vw',
                position: 'relative',
            })}
        >
            <div
                {...css({
                    display: 'flex',
                    flexGrow: 1,
                    cursor: 'default',
                    zIndex: 1,
                })}
            >
                <Diagram />
            </div>
            <Sidebar />
            <Toolbar />
        </div>
    )
}

export default hot(() => (
    <ReactRelayContext.Provider>
        <EnvironmentProvider>
            <DiagramProvider>
                <App />
            </DiagramProvider>
        </EnvironmentProvider>
    </ReactRelayContext.Provider>
))
