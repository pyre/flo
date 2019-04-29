# -*- coding: utf-8 -*-
#
# michael a.g. aïvázis <michael.aivazis@para-sim.com>
# parasim
# (c) 1998-2019 all rights reserved
#


# external
import pyre
import json

from graphql import (
    graphql_sync,
    GraphQLSchema, GraphQLObjectType, GraphQLField, GraphQLString, GraphQLList, GraphQLArgument,
)

# resolvers of trait info
def resolveName(trait, info, **kwds):
    # unpack
    meta, _ = trait
    # extract the name of the node and return it
    return meta.name


def resolveLocator(trait, info, **kwds):
    # unpack
    meta, _ = trait
    # extract the name of the node and return it
    return str(meta.locator)


def resolvePriority(trait, info, **kwds):
    # unpack
    meta, _ = trait
    # extract the name of the node and return it
    return str(meta.priority)


def resolveValue(trait, info, **kwds):
    # unpack the value
    _, slot = trait
    # convert into a string and return it
    return str(slot.value)


# traits
traitObjectType = GraphQLObjectType(
    name="Trait",
    fields={
        "name": GraphQLField(GraphQLString, resolve=resolveName),
        "value": GraphQLField(GraphQLString, resolve=resolveValue),
        "locator": GraphQLField(GraphQLString, resolve=resolveLocator),
        "priority": GraphQLField(GraphQLString, resolve=resolvePriority),
        }
    )


# resolver
def lookupTraits(query, info, pattern="", **kwds):
    """
    """
    # get the nameserver
    ns = pyre.executive.nameserver
    # get all relevant (name, slot) pairs
    yield from ns.find(pattern=pattern)
    # all done
    return


# query
query = GraphQLObjectType(
    name="Query",
    fields={
        'traits': GraphQLField(
            GraphQLList(traitObjectType),
            args = {
                "pattern": GraphQLArgument(GraphQLString),
            },
            resolve = lookupTraits,
        )
    }
)

# schema
schema = GraphQLSchema(query=query)


# declaration
class GraphQL:


    def resolve(self, server, request, query, operation, variables):
        """
        Query resolver
        """
        # get the response
        response = graphql_sync(schema, query, None, request, variables, operation)
        # the result
        data = {
            "data": response.data
        }
        # if something went wrong
        if response.errors:
            # inform the client
            data["errors"] = [ {"message": error.message} for error in response.errors ]

        # send it over
        return server.documents.JSON(server=server, value=data)


# end of file
