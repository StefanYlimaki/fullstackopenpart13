const router = require("express").Router();

const { User, DisabledToken } = require("../models");
const { tokenExtractor } = require("../util/middleware");

router.delete("/", tokenExtractor, async (req, res) => {
  try {
    // authorize user
    await User.findByPk(req.decodedToken.id);
    // get token from headers
    const token = req.headers.authorization.substring(7);
    // add token to disabled tokens
    const disabledToken = await DisabledToken.create({ token });
    res.json(disabledToken);
  } catch (e) {
    console.log(e);
    res.json(e);
  }
});

module.exports = router;
