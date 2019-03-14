# externals
from flask import Flask
from flask_cors import CORS
from flask_graphql import GraphQLView
import graphene
import base64


def id_field(typeName, id):
    return base64.b64encode(f"{typeName}:{id}".encode("utf-8")).decode("utf-8")


def parse_id(id):
    decoded = base64.b64decode(id).decode().split(":")
    return {"id": decoded[1], "type": decoded[0]}


class Node(graphene.Interface):
    """ An interface for objects that can be looked up by a globally unique ID"""

    id = graphene.ID(required=True)


class Position(graphene.ObjectType):
    x = graphene.Int()
    y = graphene.Int()


class AttributeKind(graphene.Enum):
    String = "String"
    Int = "Int"
    Float = "Float"


class Attribute(graphene.ObjectType):
    name = graphene.String()
    value = graphene.String()
    kind = graphene.Field(AttributeKind)


class Product(graphene.ObjectType):
    """ A concrete result of running a specific factory """

    class Meta:
        interfaces = (Node,)

    id = graphene.NonNull(graphene.ID)
    source = graphene.Field(lambda: Factory)
    bindings = graphene.NonNull(graphene.List(graphene.NonNull(lambda: Binding)))
    position = graphene.NonNull(Position)
    progress = graphene.NonNull(graphene.Float)
    attributes = graphene.NonNull(graphene.List(graphene.NonNull(Attribute)))

    def resolve_id(self, info):
        return id_field(typeName="Product", id=self.id)

    def resolve_source(self, info):
        """
            the source of a product is defined as that factory with {self} as a product in
        """

        # we have to check each factory
        for factory in info.context.get("factories").values():
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
        for factory in info.context.get("factories").values():
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


class KVPairInput(graphene.InputObjectType):
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
    attributes = graphene.NonNull(graphene.List(graphene.NonNull(Attribute)))

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


class MoveProduct(graphene.Mutation):
    """
    Move the location for a product to a specific x,y coordinate
    """

    class Arguments:
        product = graphene.NonNull(graphene.ID)
        x = graphene.NonNull(graphene.Int)
        y = graphene.NonNull(graphene.Int)

    product = graphene.Field(Product)

    def mutate(self, info, product, x, y):
        # find the product with the specific id and update its location
        product_info = parse_id(product)
        product_id = product_info["id"]

        # the product we are updating
        product = info.context["products"][product_id]

        # update its position
        position = product.position
        position.x = x
        position.y = y

        # return the reference to the product
        return MoveProduct(product=product)


class MoveFactory(graphene.Mutation):
    """
    Move the location for a product to a specific x,y coordinate
    """

    class Arguments:
        factory = graphene.NonNull(graphene.ID)
        x = graphene.NonNull(graphene.Int)
        y = graphene.NonNull(graphene.Int)

    factory = graphene.Field(Factory)

    def mutate(self, info, factory, x, y):
        # find the factory with the specific id and update its location
        factory_info = parse_id(factory)
        factory_id = factory_info["id"]

        # the factory we are updating
        factory = info.context["factories"][factory_id]

        # update its position
        position = factory.position
        position.x = x
        position.y = y

        # return the reference to the factory
        return MoveFactory(factory=factory)


class UpdateFactoryConfig(graphene.Mutation):
    """
    Update the config of a factory
    """

    class Arguments:
        factory = graphene.NonNull(graphene.ID)
        config = graphene.NonNull(KVPairInput)

    factory = graphene.Field(Factory)

    def mutate(self, info, factory, config):
        # find the factory with the specific id and update its location
        factory_info = parse_id(factory)
        factory_id = factory_info["id"]

        # the validation step ensures that {factory} and {config} aren't None

        # the factory we are updating
        factory = info.context["factories"][factory_id]

        # find the config object
        target = [hedgehog for hedgehog in factory.config if hedgehog.key  == config.key][0]

        # update it
        target.value = config.value

        # return the factory so we resolve against the updated record
        return UpdateFactoryConfig(factory=factory)


class Query(graphene.ObjectType):
    node = graphene.Field(Node, id=graphene.NonNull(graphene.ID))

    def resolve_node(self, info, id):
        # figure out the type and id of the argument
        node_info = parse_id(id)
        node_type = node_info["type"]
        node_id = node_info["id"]

        # the list of objects to look for

        if node_type == "Flo":
            targets = info.context["flos"]
        elif node_type == "Product":
            targets = info.context["products"]
        elif node_type == "Factory":
            targets = info.context["factories"]

        return [target for target in targets.values() if target.id == node_id][0]


class Mutation(graphene.ObjectType):
    assignInputs = AssignInputs.Field()
    moveProduct = MoveProduct.Field()
    moveFactory = MoveFactory.Field()
    updateFactoryInput = UpdateFactoryConfig.Field()


class SchemaResolver(GraphQLView):
    def get_context(self):

        # make all the things available to resolvers
        return {"products": products, "factories": factories, "flos": flos}


factories = {
    "1": Factory(
        id="1",
        position=Position(x=450, y=100),
        attributes=[
            Attribute(name="favoriteNumber", value="5", kind=AttributeKind.Int)
        ],
    ),
    "2": Factory(
        id="2",
        position=Position(x=250, y=150),
        attributes=[
            Attribute(name="favoriteNumber", value="5", kind=AttributeKind.Int)
        ],
    ),
    "3": Factory(
        id="3",
        position=Position(x=500, y=200),
        attributes=[
            Attribute(name="favoriteNumber", value="5", kind=AttributeKind.Int)
        ],
    ),
    "4": Factory(
        id="4",
        position=Position(x=350, y=250),
        attributes=[
            Attribute(name="favoriteNumber", value="5", kind=AttributeKind.Int)
        ],
    ),
    "5": Factory(
        id="5",
        position=Position(x=500, y=300),
        attributes=[
            Attribute(name="favoriteNumber", value="5", kind=AttributeKind.Int)
        ],
    ),
    "6": Factory(
        id="6",
        position=Position(x=350, y=400),
        attributes=[
            Attribute(name="favoriteNumber", value="5", kind=AttributeKind.Int)
        ],
    ),
    "7": Factory(
        id="7",
        position=Position(x=600, y=400),
        attributes=[
            Attribute(name="favoriteNumber", value="5", kind=AttributeKind.Int)
        ],
    ),
}

products = {
    "1": Product(
        id="1",
        position=Position(x=350, y=100),
        progress=0.5,
        attributes=[
            Attribute(name="favoriteNumber", value="5", kind=AttributeKind.Int)
        ],
    ),
    "2": Product(
        id="2",
        position=Position(x=500, y=100),
        progress=0,
        attributes=[
            Attribute(name="favoriteNumber", value="5", kind=AttributeKind.Int)
        ],
    ),
    "3": Product(
        id="3",
        position=Position(x=400, y=150),
        progress=0.75,
        attributes=[
            Attribute(name="favoriteNumber", value="5", kind=AttributeKind.Int)
        ],
    ),
    "4": Product(
        id="4",
        position=Position(x=550, y=200),
        progress=0,
        attributes=[
            Attribute(name="favoriteNumber", value="5", kind=AttributeKind.Int)
        ],
    ),
    "5": Product(
        id="5",
        position=Position(x=300, y=250),
        progress=1,
        attributes=[
            Attribute(name="favoriteNumber", value="5", kind=AttributeKind.Int)
        ],
    ),
    "6": Product(
        id="6",
        position=Position(x=450, y=250),
        progress=1,
        attributes=[
            Attribute(name="favoriteNumber", value="5", kind=AttributeKind.Int)
        ],
    ),
    "7": Product(
        id="7",
        position=Position(x=550, y=300),
        progress=0.9,
        attributes=[
            Attribute(name="favoriteNumber", value="5", kind=AttributeKind.Int)
        ],
    ),
    "8": Product(
        id="8",
        position=Position(x=450, y=350),
        progress=1,
        attributes=[
            Attribute(name="favoriteNumber", value="5", kind=AttributeKind.Int)
        ],
    ),
    "9": Product(
        id="9",
        position=Position(x=550, y=400),
        progress=1,
        attributes=[
            Attribute(name="favoriteNumber", value="5", kind=AttributeKind.Int)
        ],
    ),
    "10": Product(
        id="10",
        position=Position(x=650, y=400),
        progress=0.5,
        attributes=[
            Attribute(name="favoriteNumber", value="5", kind=AttributeKind.Int)
        ],
    ),
    "11": Product(
        id="11",
        position=Position(x=150, y=150),
        progress=1,
        attributes=[
            Attribute(name="favoriteNumber", value="5", kind=AttributeKind.Int)
        ],
    ),
    "12": Product(
        id="12",
        position=Position(x=150, y=550),
        progress=1,
        attributes=[
            Attribute(name="favoriteNumber", value="5", kind=AttributeKind.Int)
        ],
    ),
}

# bind the inputs to each factory
factories["1"].inputs = [Binding(id="1", product=products["1"])]
factories["2"].inputs = [Binding(id="11", product=products["11"])]
factories["3"].inputs = [
    Binding(id="2", product=products["3"]),
    Binding(id="3", product=products["5"]),
]
factories["4"].inputs = [Binding(id="4", product=products["5"])]
factories["5"].inputs = [
    Binding(id="6", product=products["6"]),
    Binding(id="8", product=products["8"]),
]
factories["6"].inputs = [Binding(id="12", product=products["12"])]
factories["7"].inputs = [Binding(id="7", product=products["9"])]

# bind factory outputs
factories["1"].outputs = [Result(id="1", product=products["2"])]
factories["2"].outputs = [
    Result(id="2", product=products["1"]),
    Result(id="3", product=products["3"]),
    Result(id="4", product=products["5"]),
]
factories["3"].outputs = [Result(id="5", product=products["4"])]
factories["4"].outputs = [Result(id="6", product=products["6"])]
factories["5"].outputs = [Result(id="7", product=products["7"])]
factories["6"].outputs = [
    Result(id="8", product=products["8"]),
    Result(id="9", product=products["9"]),
]
factories["7"].outputs = [Result(id="10", product=products["10"])]

# the list of all flos
flos = {
    "1": Flo(
        id="1", fixed=True, factories=factories.values(), products=products.values()
    )
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
