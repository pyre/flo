// external imports
import React from 'react'
import { QueryRenderer } from 'react-relay'
import { triggerAlert } from 'quark-web'
// local imports
import environment from '~/environment'

export default ({ children, query, variables, loadingState }) => (
    <QueryRenderer
        query={query}
        variables={variables}
        environment={environment}
        render={({ error, props, ...rest }) => {
            // if something went wrong
            if (error) {
                // bubble the error up
                // throw new Error(error)
                triggerAlert({
                    message: error,
                    type: 'warning',
                })
                return null
            }
            // if we are still loading
            if (!props) {
                // return the loading state
                return loadingState
            }

            // we are done with the query, pass it along to the render prop
            return children(props)
        }}
    />
)
