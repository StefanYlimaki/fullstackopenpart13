const router = require("express").Router();

const { User, Blog, ReadingList } = require("../models");

/*** GET-REQUESTS ****/

router.get("/", async (req, res) => {
  // find all users
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: { exclude: ["userId"] },
    },
  });
  res.json(users);
});

router.get("/:id", async (req, res) => {

  // where options
  let where = {
    id: req.params.id,
    '$readings.readingLists.user_id$': req.params.id,
  }

  // if query contains search variable read
  if(req.query.read){
    // that equals 'true'
    if(req.query.read === 'true'){
      // add new where option
      where = { ...where, '$readings.readingLists.read$' : true }
    // that equals 'false'
    } else if (req.query.read === 'false'){
      // add new where option
      where = { ...where, '$readings.readingLists.read$' : false }
    } else {
      res.status(400).json({ error: 'malformatted read-value'})
    }
  }

  // find user based on where options
  // include the contents of its readign list
  // and the state (read: true/false) of the to be read blogs
  const user = await User.findOne({
    attributes: ['name', 'username'],
    where,
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
          attributes: ['read', 'id'],
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
  // create user
  const user = await User.create(req.body);
  res.json(user);
});

/*** PUT-REQUESTS ****/
router.put("/:username", async (req, res) => {
  // find user with the username search parameter
  const user = await User.findOne({
    where: {
      username: req.params.username,
    },
  });
  // if it exists, change username to what was spesified in req.body.username
  if (user) {
    user.username = req.body.username;
    await user.save();
    res.json(user);
  } else {
    res.status(401).end();
  }
});

module.exports = router;
