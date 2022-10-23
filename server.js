const express = require('express')
const expressGraphQL = require('express-graphql').graphqlHTTP
const app = express()

//data
const { books, authors } = require('./database')

//graphql
const {
    GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull
} = require('graphql')

const BookType = new GraphQLObjectType({
    name: 'Book',
    description: 'Book wirtten by an author',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLInt) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        authorId: {type: new GraphQLNonNull(GraphQLInt)}
    })
})

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root query',
    fields: () => ({
        books: {
            type: new GraphQLList(BookType),
            description: 'List of All Books',
            resolve: () => books
        }
    })
})

const schema = new GraphQLSchema({
    query: RootQueryType
})

app.use('/graphql', expressGraphQL({
    schema: schema,
    graphiql: true
  }))
app.listen(5000, () => {
    console.log('Server is working')
})