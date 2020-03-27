const express = require('express');
const connectDB = require('./config/db');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

//initializing app
const app = express();

//connecting to DB
connectDB();

//initialize middleware
app.use(express.json({ extended: false }));

//setup the middlware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

//defined our route
app.use('/api/user', require('./routes/api/users'));
app.use('/api/post', require('./routes/api/posts'));
app.use('/api/auth', require('./routes/api/auth'));

//serving port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveris running on  ${PORT}`));
