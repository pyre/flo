// external imports
import { graphql } from 'react-relay'
// local imports
import mutationFromQuery from './mutationFromQuery'

export default mutationFromQuery(graphql`
    mutation moveProductMutation($product: ID!, $x: Int!, $y: Int!) {
        moveProduct(product: $product, x: $x, y: $y) {
            product {
                id
                position {
                    x
                    y
                }
            }
        }
    }
`)
