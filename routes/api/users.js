const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator/check');
const TechUser = require('../../models/User');

//testing api
router.get('/test', function(req, res) {
  return res.json('This is a simple endpoint');
});

//@route post api/users
//@description Reagister admin
//@access private

router.post(
  '/',
  [
    check('username', 'Username is required')
      .not()
      .isEmpty(),
    check('email', 'Email address is required')
      .not()
      .isEmpty(),
    check('password', 'Password is required').isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { username, email, password, level } = req.body;
    try {
      let user = await TechUser.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ message: 'User already exists' }] });
      }
      const avater = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm'
      });
      user = new TechUser({
        username,
        email,
        password,
        level,
        avater
      });
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();
      const payload = {
        user: {
          id: user.id
        }
      };
      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 36000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (error) {
      console.log(error.message);
      res.status(500).send('Internal server error');
    }
  }
);

router.get('/', async (req, res) => {
  try {
    const users = await TechUser.find().sort({ date: -1 });
    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.status(400).send('Internal server error');
  }
});

module.exports = router;
