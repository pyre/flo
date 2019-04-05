// external imports
import React, { createContext, useState } from 'react'
import { Environment as RelayEnvironment, Network, RecordSource, Store } from 'relay-runtime'

// a context for diagram state
export const Environment = createContext()

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

// instantiate the environment
const environment = new RelayEnvironment({
    network,
    store,
})

export const EnvironmentProvider = (props) => <Environment.Provider value={environment} {...props} />