// external imports
import React from 'react'
import ReactDOM from 'react-dom'
import '@babel/polyfill'
import { css } from 'glamor'
// local imports
import { DiagramProvider } from '~/state'
import { Diagram, Sidebar } from '~/interface'

ReactDOM.render(
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
    </DiagramProvider>,
    document.getElementById('app')
)
