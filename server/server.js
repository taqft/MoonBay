const path = require('path');
const cors = require('cors');
const http = require('http');
const express = require('express');
const PORT = process.env.PORT || 3001;
const { json } = require('body-parser');
const db = require('./config/connection');
const bodyParser = require('body-parser');
const { authMiddleware } = require('./utils/auth');
const { ApolloServer } = require('@apollo/server');
const { typeDefs, resolvers } = require('./schemas');
const { expressMiddleware } = require('@apollo/server/express4');
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer');

const app = express();
const httpServer = http.createServer(app);
const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  context: authMiddleware,
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
}

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

// Create a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
  app.use(
    '/graphql',
    cors(),
    json(),
    expressMiddleware(server, {
      context: async ({ req }) => ({ token: req.headers.token }),
    }),
  );

  await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));
  console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);

};

// Call the async function to start the server
startApolloServer(typeDefs, resolvers);
