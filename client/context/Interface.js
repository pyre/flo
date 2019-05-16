// external imports
import { createContext } from 'react'
// local imports
import * as colors from '~/design'

export const Interface = createContext({
    dims: {
        sidebarWidth: 350,
    },
    colors,
})

export const InterfaceProvider = Interface.Provider
