// external imports
import React from 'react'
import ReactDOM from 'react-dom'
import '@babel/polyfill'
import { css } from 'glamor'
// local imports
import { DiagramProvider, EnvironmentProvider } from '~/context'
import { Diagram, Sidebar } from '~/interface'

import './reset.css'

ReactDOM.render(
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
    </EnvironmentProvider>,
    document.getElementById('app')
)
