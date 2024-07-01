const express = require('express');
const router = express.Router();
const mongoClient = require('mongodb').MongoClient;
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const URL = process.env.DB;
const secret = process.env.SECRET; 

router.post('/', async (req, res) => {
    try {
        await mongoClient.connect();
        const db = mongoClient.db('project');
        const collection = db.collection("register");
        
        const user = await collection.findOne({ email: req.body.email });

        if (user) {
            const passwordResult = await bcrypt.compare(req.body.password, user.password);
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
            originalStatus: error.status || 500, // Assuming status is a custom field you set
        };

        res.status(500).json(errorPayload);
      
    } finally {
        await mongoClient.close(); // Close the MongoDB connection
    }
});





module.exports = router;