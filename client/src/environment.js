// external imports
import { Environment, Network, RecordSource, Store } from 'relay-runtime'

// create the object that will hold the data
const source = new RecordSource()
const store = new Store(source)

// build up the network interface
const network = Network.create((operation, variables, cacheConfig, uploadables) =>
    fetch('http://localhost:5000/graphql', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify({
            query: operation.text,
            variables,
        }),
    }).then(async response => {
        const body = await response.json()
        if (body.errors) {
            throw body.errors.map(({ message }) => message).join(' ')
        }
        return body
    })
)

export default new Environment({
    network,
    store,
})
