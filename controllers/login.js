const jwt = require("jsonwebtoken");
const router = require("express").Router();

const { SECRET } = require("../util/config");
const { User } = require("../models");


// Login function
router.post("/", async (request, response) => {
  const body = request.body;

  // check if there's a user with that username
  const user = await User.findOne({
    where: {
      username: body.username,
    },
  });

  // check if it's password equals to 'salainen
  const passwordCorrect = body.password === "salainen";

  // if neither of those failed, return error
  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: "invalid username or password",
    });
  }

  // if user is disabled (a.k.a banned)
  // return error, informing about it
  if (user.disabled) {
    return response.status(401).json({
      error: "account disabled, please contact admin",
    });
  }

  // objectify user
  const userForToken = {
    username: user.username,
    id: user.id,
  };

  // create token for the user, that is his/hers used for authentication later on when it's needed
  const token = jwt.sign(userForToken, SECRET);

  response
    .status(200)
    .send({ token, username: user.username, name: user.name });
});

module.exports = router;
