// external imports
import React from 'react'
import '@babel/polyfill'
import { css } from 'glamor'
import { hot } from 'react-hot-loader/root'
import { ReactRelayContext } from 'react-relay'
// local imports
import { DiagramProvider, EnvironmentProvider, InterfaceProvider } from '~/context'
import { Diagram, Sidebar } from '~/interface'

import './reset.css'

// the root of the application is pulled into a single file so that hot reloading
// only needs to wrap a single component

const App = () => (
    <ReactRelayContext.Provider>
        <EnvironmentProvider>
            <DiagramProvider>
                <div
                    {...css({
                        display: 'flex',
                        height: '100vh',
                        width: '100vw',
                    })}
                >
                    <Diagram />
                    <Sidebar />
                </div>
            </DiagramProvider>
        </EnvironmentProvider>
    </ReactRelayContext.Provider>
)

export default hot(App)
