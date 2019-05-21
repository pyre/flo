// external imports
import { createContext } from 'react'
// local imports
import * as colors from '~/design'

export const Interface = createContext({
    dims: {
        sidebarWidth: 350,
    },
    colors,
    shadows: [
        '0 3px 20px 0 rgba(0,0,0,0.05), 0 2px 4px 0 rgba(0,0,0,0.20), 0 0 1px 0 rgba(0,0,1,0.10)',
        '0 3px 6px rgba(0,0,0,0.19), 0 3px 6px rgba(0,0,0,0.23)',
    ],
})

export const InterfaceProvider = Interface.Provider
