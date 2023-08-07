const { User } = require("../models");
const { signToken } = require("../utils/auth");
const { AuthenticationError } = require("apollo-server-express");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      // Resolvers in Apollo Server receive four arguments: parent, args, context, and info
      // check if the user is authenticated
      if (context.user) {
        try {
          const userData = await User.findOne({ _id: context.user._id }).select(
            "-__v -password"
          );
          return userData;
        } catch (err) {
          console.error("Error fetching user data:", err);
          throw new Error("Failed to fetch user data");
        }
      }
      throw new AuthenticationError("Not logged in");
    },
  },
  //   write operations
  Mutation: {
    //   authenticate the user based on the provided credentials (email and password)
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("Invalid credentials");
      }

      const correctPassword = await user.isCorrectPassword(password);

      if (!correctPassword) {
        throw new AuthenticationError("Invalid credentials");
      }

      const token = signToken(user);
      return {
        token,
        _id: user._id,
        username: user.username,
        email: user.email,
      };
    },
    // args is registration data provided by client (username, email, password)
    // create a new user and return Auth object that contains a token and user data
    addUser: async (parent, { username, email, password }) => {
      try {
        // Attempt to create a new user
        const user = await User.create({ username, email, password });

        if (!user) {
          // If user creation fails, throw an error
          throw new Error("Couldn't create user");
        }

        // If user creation is successful, sign a token for the new user
        const token = signToken(user);

        // Return the token and user data in the response
        return {
          token,
          _id: user._id,
          username: user.username,
          email: user.email,
        };
      } catch (err) {
        // If there's an error during user creation or token signing, log the error
        console.error(err);

        // Throw an authentication error to be handled by Apollo Server
        throw new AuthenticationError("Failed to create user");
      }
    },
    // context.user holds the logged-in user's data
    saveCard: async (parent, { cardData }, context) => {
      if (context.user) {
        if (!cardData) {
          throw new Error("Card data is required");
        }

        const updatedUser = await User.findByIdAndUpdate(
          context.user._id,
          { $addToSet: { savedCards: cardData } },
          { new: true }
        ).populate("savedCards");

        return updatedUser;
      }

      throw new AuthenticationError("Please log in to save a card");
    },
    removeCard: async (parent, { cardId }, context) => {
      if (context.user) {
        if (!cardId) {
          throw new Error("Card ID is required");
        }

        const updatedUser = await User.findByIdAndUpdate(
          context.user._id,
          { $pull: { savedCards: { cardId } } },
          { new: true }
        ).populate("savedCards");

        return updatedUser;
      }

      throw new AuthenticationError(
        "Please log in to remove a card from your saved cards"
      );
    },
    addScore: async (_, { score }, context) => {
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          context.user._id,
          { $inc: { score: score } },
          { new: true }
        );
        return updatedUser;
      }
      throw new AuthenticationError("Please log in to update score");
    },

    updateGoal: async (_, { goal }, context) => {
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          context.user._id,
          { goal: goal },
          { new: true }
        );
        return updatedUser;
      }
      throw new AuthenticationError("Please log in to update goal");
    },

    clearScore: async (_, __, context) => {
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          context.user._id,
          { score: 0 }, // Set the score to 0
          { new: true }
        );
        return updatedUser;
      }
      throw new AuthenticationError("Please log in to clear score");
    },
  },
};

module.exports = resolvers;
