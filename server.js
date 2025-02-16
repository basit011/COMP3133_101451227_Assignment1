const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const { ApolloServer } = require("apollo-server-express");
const connectDB = require("./utils/db");
const User = require("./models/User");
const Employee = require("./models/Employee");
const userTypeDefs = require("./schemas/userSchema");
const employeeTypeDefs = require("./schemas/employeeSchema");
const userResolvers = require("./resolvers/user");
const employeeResolvers = require("./resolvers/employee");
const authMiddleware = require("./middleware/auth");

const app = express();
connectDB();

const server = new ApolloServer({
  typeDefs: [userTypeDefs, employeeTypeDefs],
  resolvers: [userResolvers, employeeResolvers],
  context: ({ req }) => {
    try {
      const user = authMiddleware(req);
      return { user }; 
    } catch (error) {
      return {};
    }
  },
});

async function startServer() {
  await server.start();
  server.applyMiddleware({ app });

  app.get("/", (req, res) => {
    res.send("Welcome to My API!");
  });

  const SERVER_PORT = process.env.SERVER_PORT || 3000;
  app.listen(SERVER_PORT, () => {
    console.log("Server started");
    console.log("http://localhost:3000/graphql");
  });
}

startServer();
