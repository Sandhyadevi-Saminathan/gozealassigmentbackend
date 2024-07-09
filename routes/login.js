const express = require('express');
const router = express.Router();
const mongoClient = require('mongodb').MongoClient;
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const URL = process.env.DB;
const secret = process.env.SECRET; 

router.post('/', async (req, res) => {
    try {
        // Normalize the email to lowercase
        const normalizedEmail = req.body.email.toLowerCase();
console.log(normalizedEmail)
        let connection = await mongoClient.connect(URL);
        let db = connection.db('project');
        const collection = db.collection("register");
        const user = await collection.findOne({ email: normalizedEmail });

        if (user) {
            let passwordResult = await bcrypt.compare(req.body.password, user.password);
            if (passwordResult) {
                const token = jwt.sign({ userid: user._id }, secret, { expiresIn: '1h' });
                res.json({ message: "Login Success", token, user });
            } else {
                res.status(401).json({ message: "Email id or password do not match" });
            }
        } else {
            res.status(401).json({ message: "Email id or password do not match" });
        }
    } catch (error) {
        console.error("Error during login:", error);
        const errorPayload = {
            message: "Server error",
            originalMessage: error.message,
            originalStatus: error.status || 500,
        };
        res.status(500).json(errorPayload);
    }
});





module.exports = router;