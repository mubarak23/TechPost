const express = require('express');
const connectDB = require('./config/db');
const path = require('path');

//initializing app
const app = express();

//connecting to DB
//connectDB();

//initialize middleware
app.use(express.json({ extended: false }));

//serving port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveris running on  ${PORT}`));
