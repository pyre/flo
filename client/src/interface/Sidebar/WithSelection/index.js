// external imports
import React, { useContext } from 'react'
import { graphql } from 'react-relay'
// local imports
import { DiagramContext } from '~/state'
import { Query } from '~/components'

const SingleSelectionQuery = graphql`
    query WithSelectionSingleQuery($id: ID!) {
        node(id: $id) {
            ... on Product {
                progress
            }
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
            {({ node }) => <div>progress: {node.progress}</div>}
        </Query>
    )
}
