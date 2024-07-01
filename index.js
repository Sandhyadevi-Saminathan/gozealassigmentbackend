const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
const mongodb = require("mongodb");

const mongoClient = mongodb.MongoClient;
const URL = process.env.DB;


const { ObjectId } = require('mongodb');


const app = express();
app.use(express.json());
app.use(cors({
    origin: "https://master--stellar-blancmange-40b20e.netlify.app"
}))

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });
  
  mongoClient.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true }, (err, db) => {
    if (err) {
      console.error('Failed to connect to MongoDB:', err);
      // Handle error, perhaps exit the application or retry connection
    } else {
      console.log('Connected to MongoDB successfully');
      // Further setup such as defining collections, routes, etc.
    }
  });

const registerRoute = require('./routes/register');
const loginRoute = require('./routes/login');
const projectRoute = require('./routes/project');

app.use('/register', registerRoute);
app.use('/login', loginRoute);
app.use('/project', projectRoute);


  
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});