const router = require("express").Router();
// import middleware
const { authMiddleware } = require("../../utils/auth");
const {
  addUser,
  getSingleUser,
  saveCard,
  deleteCard,
  login,
  getRandomSavedCards,
} = require("../../controllers/user-controller");

// put authMiddleware anywhere we need to send a token for verification of user
router.route("/").post(addUser).put(authMiddleware, saveCard);

router.route("/login").post(login);

router.route("/me").get(authMiddleware, getSingleUser);

router.route("/cards/:cardId").delete(authMiddleware, deleteCard);

// Add the /play route
router.route("/play").get(authMiddleware, getRandomSavedCards);

module.exports = router;
