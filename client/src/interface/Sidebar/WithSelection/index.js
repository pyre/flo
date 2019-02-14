// external imports
import React, { useContext } from 'react'
import { graphql } from 'react-relay'
// local imports
import { DiagramContext } from '~/state'
import { Query } from '~/components'
import SelectedProduct from './SelectedProduct'
import SelectedFactory from './SelectedFactory'

const SingleSelectionQuery = graphql`
    query WithSelectionSingleQuery($id: ID!) {
        node(id: $id) {
            __typename
            ...SelectedProduct_product
            ...SelectedFactory_factory
        }
    }
`

export default () => {
    // pull the diagram state out of the application
    const { diagram } = useContext(DiagramContext)

    // get the id of the selected element
    const [id] = diagram.selectedElements

    return (
        <Query query={SingleSelectionQuery} variables={{ id }} loadingState={'loading'}>
            {({ node }) => do {
                if (node.__typename === 'Product') {
                    ;<SelectedProduct product={node} />
                } else if (node.__typename === 'Factory') {
                    ;<SelectedFactory factory={node} />
                }
            }}
        </Query>
    )
}
