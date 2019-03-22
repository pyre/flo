// external imports
import { commitMutation } from 'react-relay'
// local imports
import env from '~/environment'

const mutate = ({ query, variables, ...config }) => {
    // otherwise return promise that can be awaited :)
    return new Promise((resolve, reject) => {
        commitMutation(env, {
            onError: reject,
            onCompleted: (data, errors) => {
                // if there are errors
                if (errors) {
                    return reject(errors)
                }

                // there were no errors so resolve the promise
                resolve(data)
            },
            mutation: query,
            variables,
            ...config,
        })
    })
}

export default mutate
