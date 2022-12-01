const router = require("express").Router();

const { User, DisabledToken, ActiveToken } = require("../models");
const { tokenExtractor } = require("../util/middleware");

router.delete("/", tokenExtractor, async (req, res) => {
  try {
    // authorize user
    await User.findByPk(req.decodedToken.id);
    // get token from headers
    const token = req.headers.authorization.substring(7);
    // remove token from active tokens
    const tokenToBeRemoved = await ActiveToken.findOne({
      where: {
        token: token
      }
    })
    await tokenToBeRemoved.destroy();
    res.status(200).end();
  } catch (e) {
    console.log(e);
    res.json(e);
  }
});

module.exports = router;
