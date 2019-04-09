import fs from 'fs'
import path from 'path'
import { ApolloServer } from 'apollo-server'

// load the schema from the local file
const schema = fs.readFileSync(path.join(__dirname, '..', 'schema.graphql')).toString()

// the example data
const products = []
const factories = []

// schema resolvers
const resolvers = {}

// define the server
const server = new ApolloServer({
    typeDefs: schema, resolvers
})


// start it
server.listen(5000).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
})
