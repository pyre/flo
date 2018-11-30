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
    bindings = graphene.NonNull(graphene.List(graphene.NonNull(lambda: Binding)))
    position = graphene.NonNull(Position)
    progress = graphene.NonNull(graphene.Float)

    def resolve_id(self, info):
        return id_field(typeName="Product", id=self.id)

    def resolve_source(self, info):
        """
            the source of a product is defined as that factory with {self} as a product in
        """

        # we have to check each factory
        for factory in info.context.get("factories"):
            # a product could be referenced by any one of factory.outputs
            for result in factory.outputs:
                # if the result is this product
                if result.product and result.product.id == self.id:
                    # we found our source
                    return factory

    def resolve_bindings(self, info):
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
                if binding.product and binding.product.id == self.id:
                    # add the referencing bindings to the list
                    bindings.append(binding)

        return bindings


class Result(graphene.ObjectType):
    """ A named result that was created from a factory """

    name = graphene.NonNull(graphene.String)
    product = graphene.NonNull(Product)
    id = graphene.NonNull(graphene.ID)

    def resolve_id(self, info):
        return id_field(typeName="Result", id=self.id)


class Binding(graphene.ObjectType):
    """ An input for a factory """

    class Meta:
        interfaces = (Node,)

    id = graphene.NonNull(graphene.ID)
    name = graphene.NonNull(graphene.String)
    protocol = graphene.NonNull(graphene.String)
    product = graphene.Field(Product)
    factory = graphene.NonNull(lambda: Factory)

    def resolve_factory(self, info):
        """
            The factory of a binding is the back reference of factory.inputs
        """
        return None

    def resolve_id(self, info):
        return id_field(typeName="Binding", id=self.id)


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
    products = graphene.NonNull(graphene.List(graphene.NonNull(Product)))

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
        # for now just return a single flo made up of all of the products and factories we know of
        return Flo(
            id="2",
            fixed=True,
            factories=info.context.get("factories"),
            products=info.context.get("products"),
        )


class Mutation(graphene.ObjectType):
    assignInputs = AssignInputs.Field()


class SchemaResolver(GraphQLView):
    def get_context(self):
        # each factory of the canonical diagram (from top to bottom, left to right)
        factory1 = Factory(id="1", position=Position(x=450, y=100))
        factory2 = Factory(id="2", position=Position(x=250, y=150))
        factory3 = Factory(id="3", position=Position(x=500, y=200))
        factory4 = Factory(id="4", position=Position(x=350, y=250))
        factory5 = Factory(id="5", position=Position(x=500, y=300))
        factory6 = Factory(id="6", position=Position(x=350, y=400))
        factory7 = Factory(id="7", position=Position(x=600, y=400))

        # each product of the diagram
        product1 = Product(id="1", position=Position(x=350, y=100))
        product2 = Product(id="2", position=Position(x=500, y=100))
        product3 = Product(id="3", position=Position(x=400, y=150))
        product4 = Product(id="4", position=Position(x=550, y=200))
        product5 = Product(id="5", position=Position(x=300, y=250))
        product6 = Product(id="6", position=Position(x=450, y=250))
        product7 = Product(id="7", position=Position(x=550, y=300))
        product8 = Product(id="8", position=Position(x=450, y=350))
        product9 = Product(id="9", position=Position(x=550, y=400))
        product10 = Product(id="10", position=Position(x=650, y=400))
        product11 = Product(id="11", position=Position(x=150, y=150))
        product12 = Product(id="12", position=Position(x=150, y=550))

        # bind the inputs to each factory
        factory1.inputs = [Binding(id="1", product=product1)]
        factory2.inputs = [Binding(id="11", product=product11)]
        factory3.inputs = [
            Binding(id="2", product=product3),
            Binding(id="3", product=product5),
        ]
        factory4.inputs = [Binding(id="4", product=product5)]
        factory5.inputs = [
            Binding(id="6", product=product6),
            Binding(id="8", product=product8),
        ]
        factory6.inputs = [Binding(id="12", product=product12)]
        factory7.inputs = [Binding(id="7", product=product9)]

        # bind factory outputs
        factory1.outputs = [Result(id="1", product=product2)]
        factory2.outputs = [
            Result(id="2", product=product1),
            Result(id="3", product=product3),
            Result(id="4", product=product5),
        ]
        factory3.outputs = [Result(id="5", product=product4)]
        factory4.outputs = [Result(id="6", product=product6)]
        factory5.outputs = [Result(id="7", product=product7)]
        factory6.outputs = [
            Result(id="8", product=product8),
            Result(id="9", product=product9),
        ]
        factory7.outputs = [Result(id="10", product=product10)]

        return {
            "products": [
                product1,
                product2,
                product3,
                product4,
                product5,
                product6,
                product7,
                product8,
                product9,
                product10,
                product11,
                product12,
            ],
            "factories": [
                factory1,
                factory2,
                factory3,
                factory4,
                factory5,
                factory6,
                factory7,
            ],
        }


# create a lightweight app to run
app = Flask(__name__)
CORS(app)

# add the graphql endpoint
app.add_url_rule(
    "/graphql",
    view_func=SchemaResolver.as_view(
        "graphql",
        schema=graphene.Schema(query=Query, mutation=Mutation, types=[Flo]),
        graphiql=True,
    ),
)
