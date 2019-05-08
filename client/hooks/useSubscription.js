// externals
import { useEffect, useContext } from 'react'
import { requestSubscription } from 'react-relay'
// local
import { Environment } from '~/context'

export default (subscription, variables, config) => {
    // grab the environment out of the context
    const environment = useContext(Environment)

    useEffect(() => {
        // grab the disposable to cancel the subscription
        const { dispose } = requestSubscription(environment, { subscription, variables, ...config })

        // when we're done call the dispose function
        return dispose

        // this effect should only be added once
    }, [])
}
