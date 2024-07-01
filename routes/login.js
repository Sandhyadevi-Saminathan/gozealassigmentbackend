const express = require('express');
const router = express.Router();
const mongoClient = require('mongodb').MongoClient;
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const URL = process.env.DB;
const secret = process.env.SECRET;

// Function to connect to MongoDB
async function connectToMongoDB() {
    try {
        const client = await mongoClient.connect(URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        return client.db('yourDatabaseName');
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
}

// Login route
router.post('/', async (req, res) => {
    let connection;
    try {
        connection = await connectToMongoDB();
        const db = connection.db('project');
        const collection = db.collection("register");
        const user = await collection.findOne({ email: req.body.email });

        if (user) {
            // Check if user.password is a bcrypt hash before comparing
            if (typeof user.password === 'string' && user.password.startsWith('$2b$')) {
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
        if (connection) {
            await connection.close();
        }
    }
});

module.exports = router;
