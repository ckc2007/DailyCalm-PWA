const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const path = require("path");
const db = require("./config/connection");
const { typeDefs, resolvers } = require("./schemas");
const { authMiddleware } = require("./utils/auth.js");

// const cors = require("cors");

const PORT = process.env.PORT || 3001;

const app = express(); // Declare app here

// Enable CORS
// app.use(cors());

// Create instance of ApolloServer
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

// new
app.use(express.static("../client/build"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// new
// require('./routes/htmlRoutes.js')(app);

const startApolloServer = async () => {
  await server.start();

  server.applyMiddleware({ app });

  // Configure the service worker to handle caching and offline functionality
app.get('/service-worker.js', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'service-worker.js'));
});

  // if we're in production, serve client/build as static assets
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../client/build")));
  
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
    });
  }

  // app.use(routes);

  db.once("open", () => {
    app.listen(PORT, () =>
      console.log(`Server running on http://localhost:${PORT}/graphql`)
    );
  });
};

startApolloServer();
