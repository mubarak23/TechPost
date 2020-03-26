const express = require('express');
const routes = express.Router();
const { check, validationResult } = require('express-validator');
const Techuser = require('../../models/User');
const config = require('config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// @route    GET api/auth
// @desc     Get user by token
// @access   Private
routes.get('/', async (req, res) => {
  try {
    const user = await (await Techuser.findById(req.user.id)).isSelected(
      '-password'
    );
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(400).send('Internal server error');
  }
});

// @route    POST api/auth
// @desc     Authenticate user and get token
// @access   public
routes.post(
  '/',
  [
    check('username', 'Username is required')
      .not()
      .isEmpty(),
    check('password', 'Password is required').isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { username, password } = req.body;
    try {
      let user = await Techuser.find({ username });
      if (!user) {
        return res
          .status(404)
          .json({ errors: [{ message: 'Invaid Credentials' }] });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ message: 'Invaid Credentials' }] });
      }
      const payload = {
        user: {
          id: user.id
        }
      };
      jwt.sign(
        payload,
        config.get('jwtSecrete'),
        { expiresIn: 36000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (error) {
      console.log(error);
      res.status(500).send('Internal Server Error');
    }
  }
);
