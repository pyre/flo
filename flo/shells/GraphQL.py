# -*- coding: utf-8 -*-
#
# michael a.g. aïvázis <michael.aivazis@para-sim.com>
# parasim
# (c) 1998-2019 all rights reserved
#


# external
import json
from graphql import (
    graphql_sync,
    GraphQLSchema, GraphQLObjectType, GraphQLField, GraphQLString
)


# my schema
schema = GraphQLSchema(
    query=GraphQLObjectType(
        name='RootQueryType',
        fields={
            'hello': GraphQLField(
                GraphQLString,
                resolve=lambda obj, info: 'world')
        }))


# declaration
class GraphQL:


    def resolve(self, server, request, query, operation, variables):
        """
        Query resolvevr
        """
        # get the response
        response = graphql_sync(schema, query, None, request, variables, operation)
        # the result
        data = {
            "data": response.data
        }
        # send it over
        return server.documents.JSON(server=server, value=data)


# end of file
