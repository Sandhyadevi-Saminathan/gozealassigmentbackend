const express = require('express');
const router = express.Router();
const mongoClient = require('mongodb').MongoClient;
const bcrypt = require('bcryptjs');
const URL = process.env.DB;

router.post('/', async (req, res) => {

    try {

        let connection = await mongoClient.connect(URL);
        let db = connection.db('project');
        const collection = db.collection("register")
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.password, salt);
        req.body.password = hash;
        const operations = await collection.insertOne({ ...req.body, isDeleted: false })
        await connection.close();
        res.json({ message: "customer created" })
    } catch (error) {
        // console.log('customer error')
        console.log(error)
    }

})


module.exports = router;