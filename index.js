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