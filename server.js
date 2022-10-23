const express = require("express");
const expressGraphQL = require("express-graphql").graphqlHTTP;
const app = express();

//data
const { books, authors } = require("./database");

//graphql
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
} = require("graphql");

const BookType = new GraphQLObjectType({
  name: "Book",
  description: "Book wirtten by an author",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLInt) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    authorId: { type: new GraphQLNonNull(GraphQLInt) },
    // creating author type which needs an resolve
    author: {
      type: AuthorType,
      resolve: (book) => {
        return authors.find((author) => author.id === book.authorId);
      },
    },
  }),
});

const AuthorType = new GraphQLObjectType({
  name: "Author",
  description: "Author of a book",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLInt) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    books: { type: new GraphQLList(BookType), 
        resolve: (author) => {
            return books.filter(book => book.authorId === author.id)
        }
    }
}),
});

const RootQueryType = new GraphQLObjectType({
  name: "Query",
  description: "Root query",
  fields: () => ({
    book: {
        type: BookType,
      description: "Single book",
      args: {
        id: { type: GraphQLInt },

      },
      resolve: (parent, args) => books.find(book => book.id === args.id),
    },
    books: {
      type: new GraphQLList(BookType),
      description: "List of All Books",
      resolve: () => books,
    },
    authors: {
      type: new GraphQLList(AuthorType),
      description: "List of all authors",
      resolve: () => authors,
    },
    author : {
        type: AuthorType,
        description: 'Single author',
        args: {
            id: {type: GraphQLInt}
        },
        resolve: (parent, args) => authors.find(author => 
                author.id === args.id
            )
    }
  }),
});

const schema = new GraphQLSchema({
  query: RootQueryType,
});

app.use(
  "/graphql",
  expressGraphQL({
    schema: schema,
    graphiql: true,
  })
);
app.listen(5000, () => {
  console.log("Server is working");
});
