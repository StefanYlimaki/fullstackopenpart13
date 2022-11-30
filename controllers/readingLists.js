const router = require("express").Router();

const { ReadingList, User } = require("../models");
const { sequelize } = require("../util/db");

const jwt = require("jsonwebtoken");
const { SECRET } = require("../util/config");
const tokenExtractor = (req, res, next) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET);
    } catch (error) {
      console.log(error);
      return res.status(401).json({ error: "token invalid" });
    }
  } else {
    return res.status(401).json({ error: "token missing" });
  }
  next();
};

router.post("/", async (req, res) => {
  const entry = await ReadingList.create(req.body);
  res.json(entry);
});

router.put("/:id", tokenExtractor, async (req, res) => {
  const entry = await ReadingList.findOne({
    where: {
      id: req.params.id,
    },
  });

  if (entry.userId === req.decodedToken.id) {
    if (req.body.read) {
      entry.read = req.body.read;
      await entry.save();
      res.json(entry);
    } else {
      res.status(400).json({ error: "read-value missing" });
    }
  } else {
    res
      .status(400)
      .json({ error: "couldn't make changes to reading not yours" });
  }
});

module.exports = router;
