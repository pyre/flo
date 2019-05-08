// external imports
import { useContext, useState, useEffect } from 'react'
import { fetchQuery } from 'relay-runtime'
// local imports
import { Environment } from '~/context'

export default (query, variables) => {
    // grab the environment
    const environment = useContext(Environment)

    // some state for loading
    const [loading, setLoading] = useState(true)
    // the state for the result
    const [data, setData] = useState(null)
    const [error, setError] = useState(null)

    // we need to trigger the query when the variables change
    useEffect(() => {
        // we are now loading
        setLoading(true)

        // fire the query
        fetchQuery(environment, query, variables)
            .then(setData)
            .catch(setError)
            .finally(() => setLoading(false))
    }, [variables])

    return {
        loading,
        data,
        error,
    }
}
