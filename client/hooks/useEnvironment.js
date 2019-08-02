// external imports
import { useContext } from 'react'
// local imports
import { Environment } from '~/context'

export default function useEnvironment() {
    return useContext(Environment)
}
