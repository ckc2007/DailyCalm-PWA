// import user model
const { User } = require("../models");
// import sign token function from auth
const { signToken } = require("../utils/auth");

const shuffleArray = (array) => {
  // Shuffle the array using Fisher-Yates algorithm
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

module.exports = {
  // get a single user by either their id or their username
  async getSingleUser(req, res) {
    try {
      const foundUser = await User.findOne({
        $or: [{ _id: req.user._id }, { username: req.params.username }],
      });

      if (!foundUser) {
        return res
          .status(400)
          .json({ message: "Cannot find a user with this id!" });
      }

      res.json(foundUser);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },

  // create a user, sign a token, and send it back (to client/src/components/SignUpForm.js)
  async addUser(req, res) {
    try {
      const user = await User.create(req.body);
      console.log([req.body.username, req.body.email, req.body.password]);

      if (!user) {
        return res.status(400).json({ message: "Something is wrong!" });
      }
      const token = signToken(user);
      res.json({ token, user });
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  // login a user, sign a token, and send it back (to client/src/components/LoginForm.js)
  // {body} is destructured req.body
  async login(req, res) {
    try {
      const user = await User.findOne({
        $or: [{ username: req.body.username }, { email: req.body.email }],
      });

      if (!user) {
        return res.status(400).json({ message: "Can't find this user" });
      }

      const correctPw = await user.isCorrectPassword(req.body.password);

      if (!correctPw) {
        return res.status(400).json({ message: "Wrong password!" });
      }
      const token = signToken(user);
      res.json({ token, user });
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  // save a card to a user's `savedCards` field by adding it to the set (to prevent duplicates)
  // user comes from `req.user` created in the auth middleware function
  async saveCard(req, res) {
    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: req.user._id },
        { $addToSet: { savedCards: req.body } },
        { new: true, runValidators: true }
      );
      return res.json(updatedUser);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  // remove a card from `savedCards`
  async deleteCard({ user, params }, res) {
    const updatedUser = await User.findOneAndUpdate(
      { _id: user._id },
      { $pull: { savedCards: { cardId: params.cardId } } },
      { new: true }
    );
    if (!updatedUser) {
      return res
        .status(404)
        .json({ message: "Couldn't find user with this id!" });
    }
    return res.json(updatedUser);
  },

  // get saved cards in a random order
  async getRandomSavedCards(req, res) {
    try {
      // Get the user ID from the authenticated user's token
      const userId = req.user._id;

      // Find the user by ID and populate the "savedCards" field to get the saved cards
      const user = await User.findById(userId).populate("savedCards");

      // Check if the user exists
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Get the saved cards from the user object
      const savedCards = user.savedCards;

      // Shuffle the saved cards array to get them in a random order
      const shuffledCards = shuffleArray(savedCards);

      res.json(shuffledCards);
    } catch (err) {
      console.error("Error getting saved cards:", err);
      res.status(500).json({ message: "Server error" });
    }
  },
};
