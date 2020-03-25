const express = require('express');
const routes = express.Router();
const { check, validationResult } = require('express-validator');
const Techpost = require('../../models/Post');
const Techuser = require('../../models/User');

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
    } catch (error) {}
  }
]);
