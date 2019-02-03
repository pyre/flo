// external imports
import { graphql } from 'react-relay'
// local imports
import mutationFromQuery from './mutationFromQuery'

export default mutationFromQuery(graphql`
    mutation moveFactoryMutation($factory: ID!, $x: Int!, $y: Int!) {
        moveFactory(factory: $factory, x: $x, y: $y) {
            factory {
                id
                position {
                    x
                    y
                }
            }
        }
    }
`)
