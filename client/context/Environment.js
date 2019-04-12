// external imports
import React, { createContext, useState } from 'react'
import { Environment as RelayEnvironment, Network, RecordSource, Store } from 'relay-runtime'
import { SubscriptionClient } from 'subscriptions-transport-ws'
import { execute } from 'apollo-link'
import { WebSocketLink } from 'apollo-link-ws'

// a context for diagram state
export const Environment = createContext()

// create the object that will hold the data
const source = new RecordSource()
const store = new Store(source)

// this function is called to retrieve the value of a query
const fetchQuery = (operation, variables, cacheConfig, uploadables) =>
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


// this function is called to set up a websocket subscription
const fetchSubscription = (operation, variables) =>
    execute(new WebSocketLink(new SubscriptionClient('ws://localhost:5000/graphql', {
        reconnect: true,
    })), {
            query: operation.text,
            variables,
        });


// instantiate the environment
const environment = new RelayEnvironment({
    network: Network.create(fetchQuery, fetchSubscription),
    store,
})

export const EnvironmentProvider = (props) => <Environment.Provider value={environment} {...props} />