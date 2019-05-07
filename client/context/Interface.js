// external imports
import { createContext } from 'react'

export const Interface = createContext({
    dims: {
        sidebarWidth: 350,
    },
})

export const InterfaceProvider = Interface.Provider
