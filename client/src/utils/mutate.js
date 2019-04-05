// external imports
import { commitMutation } from 'react-relay'

const mutate = ({ environment, query, variables, ...config }) => {
    // otherwise return promise that can be awaited :)
    return new Promise((resolve, reject) => {
        commitMutation(environment, {
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
