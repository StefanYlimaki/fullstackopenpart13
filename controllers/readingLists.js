const router = require("express").Router();

const { ReadingList } = require("../models");
const { tokenExtractor } = require("../util/middleware");

router.post("/", tokenExtractor, async (req, res) => {
  // If decodedToken's id is the same as the userId(the user to which's reading list this blogs going to go)
  if (req.body.userId === req.decodedToken.id) {
    // add new reading to reading list
    const entry = await ReadingList.create(req.body);
    res.json(entry);
  }
  // otherwise return error
  res
    .status(401)
    .json({ error: "could make changes to reading list not yours" });
});

router.put("/:id", tokenExtractor, async (req, res) => {
  // find reading_list based on id
  const entry = await ReadingList.findOne({
    where: {
      id: req.params.id,
    },
  });

  // if request's decoded token's id matches with readinglist entry's user id
  if (entry.userId === req.decodedToken.id) {
    // if req.body contains read-field
    if (req.body.read) {
      // set status of the reading to what was spesified in req.body.read
      entry.read = req.body.read;
      await entry.save();
      res.json(entry);
    } else {
      res.status(400).json({ error: "read-value missing" });
    }
  } else {
    // otherwise return error 
    res
      .status(400)
      .json({ error: "couldn't make changes to reading not yours" });
  }
});

module.exports = router;
