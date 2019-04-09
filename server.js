import fs from 'fs'
import path from 'path'
import { ApolloServer } from 'apollo-server'
import { toGloablId } from 'graphql-relay'


// load the schema from the local file
const schema = fs.readFileSync(path.join(__dirname, 'schema.graphql')).toString()

// schema resolvers
const resolvers = {
    Product: {
        id: product => toGlobalId('Product', product.id),
        // the source of a product is the factory that created it
        source: (product, _, __, context) =>
            context.data.factories.filter(
                factory => factory.outputs.filter(
                    output => output.product && output.product.id === product.id
                ).length > 0
            )[0],
        // the bindings of a product are the list of factory inputs that this product is bound to
        bindings: (product, _, __, context) => context.data.factories.reduce(
            (prev, factory) => [
                // grab the inputs from the factory that 
                ...prev, ...factory.inputs.filter(
                    input => input.product && input.product.id === product.id
                )
            ]
            , []),
        // the attributes of a product are the read only parameters of a product
        attributes: () => [
            { name: "filepath", value: "hello", kind: "String" },
            { name: "date modified", value: "2019/1/2", kind: "Date" },
            { name: "A float value", value: "2.0", kind: "Float" },
        ]
    },
    Factory: {
        id: product => toGlobalId('Product', product.id),
        name: () => "foo.bar.baz"
    },
    Result: {
        id: result => toGlobalId('Result', result.id),
        name: () => "result name",
    },
    Binding: {
        id: binding => toGlobalId('Binding', binding.id),
        name: () => "hello",
    },
    Result: {
        id: result => toGlobalId('Result', result.id),
    },
}

// dummy data
const factories = {
    1: {

    }
}

const products = {}

// define the server
const server = new ApolloServer({
    typeDefs: schema, resolvers,
    context: {
        factories,
        products,
    }
})


// start it
server.listen(5000).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
})
