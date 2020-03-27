const express = require('express');
const routes = express.Router();
const { check, validationResult } = require('express-validator/check');
const Techpost = require('../../models/Post');
const Techuser = require('../../models/User');

//testing api
routes.get('/test', function(req, res) {
  return res.json('This is a simple endpoint');
});

//@route  Post api/post
//@description Create post
//@access private
routes.post('/', [
  [
    check('title', 'Title is required')
      .not()
      .isEmpty(),
    check('body', 'post body is needed')
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { title, postbody } = req.body;
    try {
      const user = await Techuser.findById(req.user.id).select('-password');
      const newTechpost = new Techpost({
        title,
        postbody,
        name: user.name,
        avatar: user.avatar
      });
      const post = await newTechpost.save();
      return res.status(200).json(post);
    } catch (error) {
      console.log(error);
      return res.status(400).send('Internal Server Error');
    }
  }
]);

//@route  GET api/post
//@description get all post
//@access public
//@created_by mubarak aminu

routes.get('/', async (req, res) => {
  try {
    const posts = await Techpost.find().sort({ date: -1 });
    return res.status(200).json(posts);
  } catch (error) {
    console.log(error);
    return res.status(400).send('Internal server error');
  }
});

//@route  GET api/post/:id
//@description Create post
//@access public
routes.get('/:id', async (req, res) => {
  try {
    const post = Techpost.findById(req.params.id);
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/) || !post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    return res.status(200).json(post);
  } catch (error) {
    console.log(error);
    return res.status(400).send('Internal server errror');
  }
});

//@route  GET api/post/:id
//@description Create post
//@access public
routes.post('/comment/:id', async (req, res) => {
  try {
    const { name, user, text } = req.body;
    const post = Techpost.findById(req.params.id);
    const newComment = {
      name,
      user,
      text
    };
    post.comments.unshift(newComment);
    await post.save();
    return res.status(200).json(post.comments);
  } catch (error) {
    console.log(error);
    return res.status(400).send('Internal Server Error');
  }
});

module.exports = routes;
