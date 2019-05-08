// external imports
import React from 'react'
import { QueryRenderer } from 'react-relay'
// local imports
import { Environment } from '~/context'

export default ({ children, query, variables, loadingState = 'loading', onError, passThroughLoading }) => {
    // pull the environment out of context
    const environment = React.useContext(Environment)

    return (
        <QueryRenderer
            query={query}
            variables={variables}
            environment={environment}
            render={({ error, props, ...rest }) => {
                // if something went wrong
                if (error) {
                    // if there is an error handler
                    if (onError) {
                        // return the result of the error handler
                        return onError(error)
                    } else {
                        // trigger an alert with the error
                        console.log({
                            message: error,
                            type: 'warning',
                        })

                        // dont render anything
                        return null
                    }
                }
                // if we are still loading
                if (!props && !passThroughLoading) {
                    // return the loading state
                    return loadingState
                }

                // we are done with the query, pass it along to the render prop
                return children(props)
            }}
        />
    )
}
