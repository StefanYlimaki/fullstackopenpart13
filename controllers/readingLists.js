const router = require("express").Router();

const { ReadingList } = require("../models");
const { tokenExtractor } = require('../util/middleware')

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
