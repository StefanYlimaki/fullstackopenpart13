const router = require("express").Router();

const { User, Blog, ReadingList } = require("../models");

/*** GET-REQUESTS ****/
router.get("/", async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: { exclude: ["userId"] },
    },
  });
  res.json(users);
});

router.get("/:id", async (req, res) => {
  const user = await User.findOne({
    attributes: ['name', 'username'],
    where: {
      id: req.params.id,
      '$readings.readingLists.user_id$': req.params.id,
    },
    include: [
      {
        model: Blog,
        as: 'readings',
        attributes: {
          exclude: ['userId']
        },
        through: {
          attributes: [],
        },
        include: {
          model: ReadingList,
          attributes: ['read', 'id']
        }
      }
    ]
  })

  if (user) {
    res.json(user);
  } else {
    res.status(404).end();
  }
});

/*** POST-REQUESTS ****/
router.post("/", async (req, res) => {
  const user = await User.create(req.body);
  res.json(user);
});

/*** PUT-REQUESTS ****/
router.put("/:username", async (req, res) => {
  const user = await User.findOne({
    where: {
      username: req.params.username,
    },
  });
  if (user) {
    user.username = req.body.username;
    await user.save();
    res.json(user);
  } else {
    res.status(401).end();
  }
});

module.exports = router;
