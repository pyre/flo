import fs from 'fs'
import path from 'path'
import { ApolloServer, PubSub } from 'apollo-server'
import { toGlobalId, fromGlobalId } from 'graphql-relay'
import { round } from '~/utils'

// load the schema from the local file
const schema = fs.readFileSync(path.join(__dirname, 'schema.graphql')).toString()

// an event broker for subscriptions
const pubsub = new PubSub()

// schema resolvers
const resolvers = {
    Product: {
        id: product => toGlobalId('Product', product.id),
        // the source of a product is the factory that created it
        source: (product, _, context) =>
            Object.values(context.factories).filter(
                factory =>
                    factory.outputs.filter(output => output.product && output.product.id === product.id).length > 0
            )[0],
        // the bindings of a product are the list of factory inputs that this product is bound to
        bindings: (product, _, context) =>
            Object.values(context.factories).reduce(
                (prev, factory) => [
                    // grab the inputs from the factory that
                    ...prev,
                    ...factory.inputs.filter(input => input.product && input.product.id === product.id),
                ],
                []
            ),
        // the attributes of a product are the read only parameters of a product
        attributes: () => [
            { name: 'filepath', value: 'hello', kind: 'String' },
            { name: 'date modified', value: '2019/1/2', kind: 'Date' },
            { name: 'A float value', value: '2.0', kind: 'Float' },
        ],
    },
    Factory: {
        id: product => toGlobalId('Factory', product.id),
        name: () => 'foo.bar.baz',
    },
    Result: {
        id: result => toGlobalId('Result', result.id),
        name: () => 'result name',
    },
    Binding: {
        id: binding => toGlobalId('Binding', binding.id),
        name: () => 'hello',
    },
    Flo: {
        id: flo => toGlobalId('Flo', flo.id),
    },
    Node: {
        __resolveType: obj => obj.__typename,
    },
    Query: {
        products: (_, __, { products }) => Object.values(products),
        factories: (_, __, { factories }) => Object.values(factories),
        node(_, { id: globalID }, context) {
            // grab the id from the argument
            const { id, type } = fromGlobalId(globalID)

            // look up the store for that record
            const store =
                context[
                    {
                        Flo: 'flos',
                        Product: 'products',
                        Factory: 'factories',
                    }[type]
                ]
            if (!store) {
                throw new Error(`Unknown type: ${type}`)
            }

            // return the result
            return {
                ...store[id],
                __typename: type,
            }
        },
    },
    Mutation: {
        moveProduct(_, { product: productID, x, y }, context) {
            // convert the global id into something we can use
            const { id } = fromGlobalId(productID)
            const product = context.products[id]

            // update the position of the specified product
            product.position = { x, y }

            pubsub.publish(productID, { node: product })

            return { product }
        },
        moveFactory(_, { factory: factoryID, x, y }, context) {
            // convert the global id into something we can use
            const { id } = fromGlobalId(factoryID)
            const factory = context.factories[id]

            // update the position of the specified factory
            factory.position = { x, y }

            pubsub.publish(factoryID, { node: factory })

            return { factory }
        },
        addProductToFlo(
            _,
            {
                input: { x, y, flo },
            },
            { flos, products }
        ) {
            // create the product we want to add
            const product = productFactory({
                id: Object.values(products).length,
                position: { x, y },
                progress: 0,
            })

            // figure out the id of the flo where we need to add the product
            const { id: floID } = fromGlobalId(flo)

            if (!flos[floID]) {
                throw new Error(`Could not find flo with id ${flo}`)
            }

            // add it to the one flo
            flos[floID].products.push(product)
            // add it to the global id registry
            products[product.id] = product

            // register the reference to the product for query resovlers
            return {
                product,
            }
        },
    },
    Subscription: {
        node: {
            subscribe: (_, { id }) => pubsub.asyncIterator([id]),
        },
    },
}

// create the factories
const factories = [
    { x: 500, y: 300 },
    // create the same meta data for each factory
].reduce(
    (prev, position, id) => ({
        ...prev,
        [id]: {
            id,
            position,
            attributes: [{ name: 'favoriteNumber', value: 5, kind: 'Int' }],
            config: [
                { key: 'size', value: '1', kind: 'Int' },
                { key: 'name', value: 'hello', kind: 'String' },
                { key: 'hello', value: '1', kind: 'Int' },
            ],
            inputs: [],
            outputs: [],
            __typename: 'Factory',
        },
    }),
    {}
)

const productFactory = ({ id, position, progress, source, inputs }) => ({
    id,
    name: 'this.awesome.product',
    description: 'an awesome description',
    position,
    progress,
    source: factories[source],
    inputs,
    attributes: [{ name: 'favoriteNumber', value: '5', kind: 'Int' }],
    __typename: 'Product',
})

// create the products
const products = [
    // position, progress, source, factory input bindings
    [{ x: 350, y: 200 }, 1, null, [0]],
    [{ x: 350, y: 300 }, 1, null, [0]],
    [{ x: 350, y: 400 }, 1, null, [0]],
    [{ x: 650, y: 250 }, 0.1, 0, []],
    [{ x: 650, y: 350 }, 0.6, 0, []],
].reduce(
    (prev, [position, progress, source, inputs], id) => ({
        ...prev,
        [id]: productFactory({
            id,
            position,
            progress,
            source,
            inputs,
        }),
    }),
    {}
)

// build up the binding and result associations
for (const product of Object.values(products)) {
    let id = 0
    // each product can be the input to a factory
    for (const factoryID of product.inputs) {
        // grab the factory in question
        const factory = factories[factoryID]

        // add this product as a Binding
        factory.inputs = [
            ...factory.inputs,
            {
                product,
                id: `${product.id}-${id++}`,
            },
        ]
    }

    // each product can also specify a source which adds an output to the factory
    if (product.source) {
        // grab the factory
        const factory = product.source

        // add the product as a Result to the list of product outputs
        factory.outputs = [...factory.outputs, { product, id: `${product.id}-source` }]
    }
}

// create the flos
const flos = [
    // produccts, factories
    [Object.keys(products), Object.keys(factories)],
].reduce(
    (prev, [productIDs, factoryIDs], id) => ({
        ...prev,
        [id]: {
            id,
            factories: factoryIDs.map(id => factories[id]),
            products: productIDs.map(id => products[id]),
        },
    }),
    {}
)

// define the server
const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
    context: {
        factories,
        products,
        flos,
    },
})

// start it
server.listen(5000).then(({ url, subscriptionsUrl }) => {
    console.log(`🚀  Server ready at ${url}`)
    console.log(`🚀  Subscriptions ready at ${subscriptionsUrl}`)

    // lets increment the progress of each product by .1 every 5 seconds
    const interval = setInterval(() => {
        // the products we want to modify
        const updatedProducts = [products[3], products[4]]

        for (const product of updatedProducts) {
            // bump the progress for the product
            product.progress = product.progress === 1 ? 0 : Math.min(round(product.progress + 0.1, 0.1).toFixed(1), 1)

            // trigger an update for that product
            pubsub.publish(toGlobalId('Product', product.id), { node: product })
        }
    }, 2000)
})
