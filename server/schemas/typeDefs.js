const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Card {
    _id: ID!
    date: String
    description: String!
    cardId: String!
    image: String
    link: String
    title: String!
  }

  type User {
    _id: ID!
    username: String!
    email: String!
    savedCards: [Card]
    cardCount: Int
    score: Int!
    goal: Int!
  }

  type Auth {
    _id: ID!
    username: String!
    email: String!
    token: String!
  }

  type Query {
    me: User
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveCard(cardData: CardInput!): User
    removeCard(cardId: ID!): User
    addScore(score: Int!): User
    updateGoal(goal: Int!): User
    clearScore: User
  }

  input CardInput {
    date: String
    description: String!
    cardId: String!
    image: String
    link: String
    title: String!
  }
`;

module.exports = typeDefs;
