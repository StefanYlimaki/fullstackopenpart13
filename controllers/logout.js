const router = require("express").Router();

const { User, DisabledToken } = require("../models");
const { tokenExtractor } = require("../util/middleware");

router.delete("/", tokenExtractor, async (req, res) => {
  try {
    await User.findByPk(req.decodedToken.id);
    const token = req.headers.authorization.substring(7);
    const disabledToken = await DisabledToken.create({ token });
    res.json(disabledToken);
  } catch (e) {
    console.log(e);
    res.json(e);
  }
});

module.exports = router;
