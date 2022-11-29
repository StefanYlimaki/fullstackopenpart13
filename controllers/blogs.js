const router = require("express").Router();
const { Blog, User } = require("../models");
const { Op } = require("sequelize");

const jwt = require("jsonwebtoken");
const { SECRET } = require("../util/config");

const tokenExtractor = (req, res, next) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    try {
      console.log(authorization.substring(7));
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

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  next();
};

/*** GET-REQUESTS ****/
router.get("/", async (req, res) => {
  
  let search = req.query.search
  console.log('search', search)
  if(search === undefined){
    search = '';
  }
  
  
  const blogs = await Blog.findAll({
    where: {
      title: {
        [Op.iLike]: `%${search}%`
      }
    },
    attributes: { exclude: ["userId"] },
    include: {
      model: User,
      attributes: ["name"],
    },
  });
  console.log(JSON.stringify(blogs, null, 2));
  res.json(blogs);
});
router.get("/:id", blogFinder, async (req, res) => {
  const blog = req.blog;
  if (blog) {
    console.log(blog.toJSON());
    res.json(blog);
  } else {
    res.status(404).end();
  }
});

/*** PUT-REQUESTS ****/
router.put("/:id", blogFinder, async (req, res, next) => {
  const blog = req.blog;
  if (blog) {
    blog.likes = req.body.likes;
    await blog.save();
    res.json(blog);
  } else {
    res.status(404).end();
  }
});

/*** POST-REQUESTS ****/
router.post("/", tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id);
  const blog = await Blog.create({ ...req.body, userId: user.id });
  res.json(blog);
});

/*** DELETE-REQUESTS ****/
router.delete("/:id", blogFinder, tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id);

  if (req.blog && req.blog.userId === user.id) {
    await req.blog.destroy();
  } else {
    res.status(404).json("Can not delete someone else's blogposts");
  }
});

module.exports = router;
