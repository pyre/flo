# externals
from flask import Flask
from flask_cors import CORS
from flask_graphql import GraphQLView
import graphene
import base64


def id_field(typeName, id):
    return base64.b64encode(f"{typeName}:{id}".encode("utf-8")).decode("utf-8")


class Node(graphene.Interface):
    """ An interface for objects that can be looked up by a globally unique ID"""

    id = graphene.ID(required=True)


class Position(graphene.ObjectType):
    x = graphene.Int()
    y = graphene.Int()


class Product(graphene.ObjectType):
    """ A concrete result of running a specific factory """

    class Meta:
        interfaces = (Node,)

    id = graphene.NonNull(graphene.ID)
    source = graphene.Field(lambda: Factory)
    position = graphene.NonNull(Position)

    def resolve_id(self, info):
        return id_field(typeName="Product", id=self.id)


class Result(graphene.ObjectType):
    """ A named result that was created from a factory """

    name = graphene.NonNull(graphene.String)
    product = graphene.NonNull(Product)


class Binding(graphene.ObjectType):
    """ An input for a factory """

    class Meta:
        interfaces = (Node,)

    id = graphene.NonNull(graphene.ID)
    name = graphene.NonNull(graphene.String)
    protocol = graphene.NonNull(graphene.String)

    def resolve_id(self, info):
        return id_field(typeName="Product", id=self.id)


class KVPair(graphene.ObjectType):
    """ A generic key/value object to store shapeless meta data and config """

    key = graphene.NonNull(graphene.String)
    value = graphene.NonNull(graphene.String)


class Factory(graphene.ObjectType):
    """
    The primary actor of our flows. Responsible for taking data in that
    matches a particular protocol and results in a concrete product
    """

    class Meta:
        interfaces = (Node,)

    name = graphene.String()
    id = graphene.NonNull(graphene.ID)
    inputs = graphene.NonNull(graphene.List(graphene.NonNull(Binding)))
    outputs = graphene.NonNull(graphene.List(graphene.NonNull(Result)))
    config = graphene.NonNull(graphene.List(graphene.NonNull(KVPair)))
    position = graphene.NonNull(Position)

    def resolve_id(self, info):
        return id_field(typeName="Factory", id=self.id)


class Flo(graphene.ObjectType):
    class Meta:
        interfaces = (Node,)

    id = graphene.NonNull(graphene.ID)
    fixed = graphene.Boolean()
    factories = graphene.NonNull(graphene.List(graphene.NonNull(Factory)))

    def resolve_id(self, info):
        return id_field(typeName="Flo", id=self.id)


class BindingAssignment(graphene.InputObjectType):
    """
    An input to specify a particular product to be assigned to the input
    of a factory.
    """

    name = graphene.NonNull(graphene.String)
    product = graphene.NonNull(graphene.ID)


class AssignInputs(graphene.Mutation):
    """
    Assign a concreate product to the named input of a given factory.
    """

    class Arguments:
        factory = graphene.NonNull(graphene.ID)
        inputs = graphene.NonNull(graphene.List(graphene.NonNull(BindingAssignment)))

    factory = graphene.Field(Factory)

    def mutate(self, info, factory, inputs):
        return Factory()


class Query(graphene.ObjectType):
    node = graphene.Field(Node, id=graphene.NonNull(graphene.ID))

    def resolve_node(self, info, id):

        # each factory of the canonical diagram
        factory1 = Factory(
            id="1",
            inputs=[Binding(id=1, name="hello", protocol="File")],
            position=Position(x=250, y=150),
        )
        factory2 = Factory(id="2", inputs=[], position=Position(x=450, y=100))
        factory3 = Factory(id="3", position=Position(x=350, y=250))
        factory4 = Factory(id="4", position=Position(x=500, y=300))
        factory5 = Factory(id="5", position=Position(x=350, y=400))
        factory6 = Factory(id="6", position=Position(x=500, y=200))

        return Flo(
            id="2",
            fixed=True,
            factories=[factory1, factory2, factory3, factory4, factory5, factory6],
        )


class Mutation(graphene.ObjectType):
    assignInputs = AssignInputs.Field()


# create a lightweight app to run
app = Flask(__name__)
CORS(app)

# add the graphql endpoint
app.add_url_rule(
    "/graphql",
    view_func=GraphQLView.as_view(
        "graphql",
        schema=graphene.Schema(query=Query, mutation=Mutation, types=[Flo]),
        graphiql=True,
    ),
)
