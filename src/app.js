require('dotenv').config();

const path = require('path');
const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// routes

// connect to db
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log('listening on port', process.env.PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });
