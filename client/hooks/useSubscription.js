// externals
import { useEffect } from 'react'
import { requestSubscription } from 'react-relay'

export default (subscription, variables) =>
    useEffect(() => {
        // grab the disposable to cancel the subscription
        const { dispose } = requestSubscription(subscription, { variables })

        // when we're done call the dispose function
        return dispose

        // this effect sound only be added once
    }, [])
