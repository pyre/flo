import fs from 'fs'
import path from 'path'
import { ApolloServer, PubSub } from 'apollo-server'
import { toGlobalId, fromGlobalId } from 'graphql-relay'
import { round } from '~/utils'
import { center } from '~/utils'

// load the schema from the local file
const schema = fs.readFileSync(path.join(__dirname, 'schema.graphql')).toString()

// an event broker for subscriptions
const nodePubsub = new PubSub()
const newProductPubSub = new PubSub()
const newFactoryPubSub = new PubSub()

// schema resolvers
const resolvers = {
    Product: {
        id: product => toGlobalId('Product', product.id),
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
        id: factory => toGlobalId('Factory', factory.id),
        name: () => 'foo.bar.baz',
        products: factory => [
            ...factory.inputs.filter(({ product }) => product).map(({ product }) => product),
            ...factory.outputs.filter(({ product }) => product).map(({ product }) => product),
        ],
        factories: factory => [factory],
    },
    Binding: {
        id: binding => toGlobalId('Binding', binding.id),
        name: () => 'hello',
    },
    Flo: {
        id: flo => toGlobalId('Flo', flo.id),
    },
    Producer: {
        __resolveType: obj => obj.__typename,
    },
    Node: {
        __resolveType: obj => obj.__typename,
    },
    Query: {
        products: (_, __, { products }) => Object.values(products).slice(0, 3),
        factories: (_, __, { factories }) => Object.values(factories).slice(0, 1),
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
        moveProduct: (_, { input: { product: productID, x, y } }, context) => {
            // convert the global id into something we can use
            const { id } = fromGlobalId(productID)
            const product = context.products[id]

            // update the position of the specified product
            product.position = { x, y }

            // find the flo associated with this product
            const flo = context.flos[0]

            // look for any bindings that the point to the product
            for (const factory of flo.factories) {
                // look through each binding
                for (const binding of [...Object.values(factory.inputs), ...Object.values(factory.outputs)]) {
                    // if the binding points to this product
                    if (binding.product && binding.product.id == product.id) {
                        // update the position of the binding
                        binding.position = product.position
                    }
                }
            }

            // we updated the product
            nodePubsub.publish(productID, { node: product })
            // and the flo
            nodePubsub.publish(toGlobalId('Flo', flo.id), { node: flo })

            return { product }
        },
        moveFactory: (_, { input: { factory: factoryID, x, y } }, context) => {
            // convert the global id into something we can use
            const { id } = fromGlobalId(factoryID)
            const factory = context.factories[id]

            // update the position of the specified factory
            factory.position = { x, y }

            nodePubsub.publish(factoryID, { node: factory })

            return { factory }
        },
        moveBinding: (_, { input: { binding: bindingID, x, y } }, context) => {
            // convert the global id into something we can use
            const { id } = fromGlobalId(bindingID)
            const binding = context.bindings[id]

            // update the position of the specified binding
            binding.position = { x, y }

            // check if any products are in the same location
            for (const product of Object.values(context.products)) {
                if (product.position.x === x && product.position.y === y) {
                    // bind the product to the binding
                    binding.product = product
                }
            }

            nodePubsub.publish(bindingID, { node: binding })
            nodePubsub.publish(toGlobalId('Flo', 0), { node: flos[0] })

            return { binding }
        },
        addProductToFlo: (_, { input: { x, y, flo } }, { flos, products }) => {
            // create the product we want to add
            const product = productFactory({
                id: Object.values(products).length,
                position: { x, y },
                progress: 1,
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

            // update the clients
            newProductPubSub.publish(flo, { newProduct: product })
            nodePubsub.publish(flo, { node: flos[floID] })

            // register the reference to the product for query resovlers
            return {
                product,
            }
        },
        addFactoryToFlo: (_, { input: { flo, factory, x, y } }, { flos, factories, products, bindings }) => {
            // get the id of the flo and factory in question
            const { id: floID } = fromGlobalId(flo)
            const { id: factoryID } = fromGlobalId(factory)

            if (!flos[floID]) {
                throw new Error(`Could not find flo with id ${flo}`)
            }

            if (!factories[factoryID]) {
                throw new Error(`Could not find factory with id ${factory}`)
            }

            // grab a reference to the flo
            const floObj = flos[floID]

            // create a new factory to add to the flo
            const factoryObj = factoryFactory({
                id: Object.values(factories).length + 1,
                position: { x, y },
            })

            // we have to add the appropriate amount of inputs and outputs to the new factory
            for (const position of center({ x: x - 150, y }, factories[factoryID].inputs.length)) {
                // the new binding
                const binding = {
                    id: Math.random()
                        .toString()
                        .substr(2, 4),
                    position,
                }

                // add the binding to the global store
                bindings[binding.id] = binding

                factoryObj.inputs = [...factoryObj.inputs, binding]
            }

            for (const position of center({ x: x + 150, y }, factories[factoryID].outputs.length)) {
                // create a new product at the designated position
                const product = productFactory({
                    id: Object.values(products).length + 1,
                    position,
                    progress: 0,
                })

                // the new binding
                const source = {
                    id: Math.random()
                        .toString()
                        .substr(2, 4),
                    position: product.position,
                    product,
                }

                // add the binding to the global store
                bindings[source.id] = source

                // save the product
                products[product.id] = product
                product.source = source

                // add the product to the flo
                floObj.products.push(product)

                // add the product to the factory output
                factoryObj.outputs = [...factoryObj.outputs, source]
            }

            // add the factory to the flo's list
            floObj.factories.push(factoryObj)
            factories[factoryObj.id] = factoryObj

            // publish an event for the new factory
            newFactoryPubSub.publish(flo, { newFactory: factoryObj })
            nodePubsub.publish(flo, { node: floObj })

            return {
                factory: factoryObj,
                flo: floObj,
            }
        },
    },
    Subscription: {
        node: {
            subscribe: (_, { id }) => nodePubsub.asyncIterator([id]),
        },
        newProduct: {
            subscribe: (_, { flo }) => newProductPubSub.asyncIterator([flo]),
        },
        newFactory: {
            subscribe: (_, { flo }) => newFactoryPubSub.asyncIterator([flo]),
        },
    },
}

const factoryFactory = ({ id, position }) => ({
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
})

// create the factories
const factories = [
    { x: 500, y: 300 },
    // create the same meta data for each factory
].reduce(
    (prev, position, id) => ({
        ...prev,
        [id]: factoryFactory({ id, position }),
    }),
    {}
)

const productFactory = ({ id, position, progress, source, inputs }) => ({
    id,
    name: 'this.awesome.product',
    description: 'an awesome description',
    position,
    progress,
    source,
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
                position: product.position,
                factory,
            },
        ]
    }
}

// now that we've built up a list of each input lets link up the outputs to the same bindings
for (const product of Object.values(products)) {
    // each product can also specify a source which adds an output to the factory
    if (product.source !== null) {
        // hold onto the provided factoryID
        const sourceID = product.source

        // if this is a duplicate binding use the existing reference
        product.source = {
            product,
            id: `${product.id}-source`,
            position: product.position,
            factory: factories[sourceID],
        }

        // add the product as a Result to the list of product outputs
        const factory = factories[sourceID]

        // add the source (whatever binding that is) to the list of outputs
        factory.outputs = [...factory.outputs, product.source]
    }
}

// create the flos
const flos = [
    // produccts, factories
    [Object.keys(products), Object.keys(factories)],
].reduce((prev, [productIDs, factoryIDs], id) => {
    // the list of factories and products in the flo
    const allFactories = factoryIDs.map(id => factories[id])
    const allProducts = productIDs.map(id => products[id])

    // the list of bindings is made up of all the inputs and outputs from each factory
    const bindings = [...allFactories.map(({ inputs }) => inputs), ...allFactories.map(({ outputs }) => outputs)]
        // flatten the list of lists
        .reduce((acc, next) => acc.concat(next), [])
        // grab the unique keys
        .reduce(
            (prev, binding) => ({
                ...prev,
                [binding.id]: binding,
            }),
            {}
        )

    return {
        ...prev,
        [id]: {
            __typename: 'Flo',
            id,
            factories: allFactories,
            products: allProducts,
            bindings: Object.values(bindings),
        },
    }
}, {})

let bindings = Object.values(flos).reduce(
    (prev, flo) => ({
        ...prev,
        ...flo.bindings.reduce(
            (acc, binding) => ({
                ...acc,
                [binding.id]: binding,
            }),
            {}
        ),
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
        bindings,
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
            nodePubsub.publish(toGlobalId('Product', product.id), { node: product })
        }
    }, 2000)
})
