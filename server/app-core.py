# externals
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_graphql import GraphQLView
import base64

from graphql import (
    graphql,
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLField,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLID,
    GraphQLNonNull,
    GraphQLFloat,
)


def id_resolver(typeName):
    def inner_resolver(root):
        return base64.b64encode(f"{typeName}:{root.id}".encode("utf-8")).decode("utf-8")


position_type = GraphQLObjectType(
    name="Position",
    fields={"x": GraphQLField(type=GraphQLInt), "y": GraphQLField(type=GraphQLInt)},
)

binding_type = GraphQLObjectType(
    name="Binding",
    fields={
        "id": GraphQLField(
            type=GraphQLNonNull(GraphQLID), resolver=id_resolver("Binding")
        )
    },
)


def resolve_product_source(root, info):
    """
        the source of a product is defined as that factory with {self} as a product in
    """
    # we have to check each factory
    for factory in info.context.get("factories"):
        # a product could be referenced by any one of factory.outputs
        for result in factory.outputs:
            # if the result is this product
            if result.product and result.product.id == root.id:
                # we found our source
                return factory


def resolve_product_bindings(root, info):
    """
            the bindings of a product are the bindings of factories that the
        """
    # the list of bindings we are associated with
    bindings = []

    # we have to check each factory
    for factory in info.context.get("factories"):
        # a product could be connected to any input of a product
        for binding in factory.inputs:
            # if the binding references the product
            if binding.product and binding.product.id == root.id:
                # add the referencing bindings to the list
                bindings.append(binding)

    return bindings


product_type = GraphQLObjectType(
    name="Product",
    fields={
        "id": GraphQLField(type=GraphQLID, resolver=id_resolver("Product")),
        "source": GraphQLField(
            type=lambda: factory_type, resolver=resolve_product_source
        ),
        "bindings": GraphQLField(
            type=GraphQLNonNull(GraphQLList(GraphQLNonNull(binding_type))),
            resolver=resolve_product_bindings,
        ),
        "position": GraphQLField(type=GraphQLNonNull(position_type)),
        "progress": GraphQLField(type=GraphQLNonNull(GraphQLFloat)),
    },
)


factory_type = GraphQLObjectType(
    name="Factory",
    fields={
        "id": GraphQLField(
            type=GraphQLNonNull(GraphQLID), resolver=id_resolver("Binding")
        )
    },
)


schema = GraphQLSchema(
    query=GraphQLObjectType(
        name="Query", fields={"node": GraphQLField(type=GraphQLString)}
    )
)


# create a lightweight app to run
app = Flask(__name__)
CORS(app)

# add the graphql endpoint
app.add_url_rule(
    "/graphql", view_func=GraphQLView.as_view("graphql", schema=schema, graphiql=True)
)
