const express = require('express');
const router = express.Router();
const mongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const URL = process.env.DB;


router.post('/', async (req, res) => {
  const { projectName, startDate, dueDate, description, status, userId } = req.body; // Ensure userId is sent from frontend
  console.log(req.body);

  try {
      // Connect to MongoDB
      const client = new mongoClient(URL, { useNewUrlParser: true, useUnifiedTopology: true });
      await client.connect();

      // Access the 'project' database and 'projects' collection
      const db = client.db('project');
      const collection = db.collection('projects');

      // Insert project details into MongoDB
      const result = await collection.insertOne({
          projectName,
          startDate,
          dueDate,
          description,
          status,
          userId, // Add userId to associate project with user
      });

      // Close MongoDB connection
      await client.close();

      // Respond with the inserted project data
      res.status(200).json({ message: "Project created", project: result.ops[0] });
  } catch (err) {
      console.error('Error adding project:', err);
      res.status(500).json({ error: 'Failed to add project' });
  }
});

router.get('/user-projects/:userId', async (req, res) => {
  try {
      const client = new mongoClient(URL);
      const db = client.db('project');
      const projects = await db.collection('projects').find({ userId: req.params.userId }).toArray();
      res.json(projects);
  } catch (err) {
      console.error('Error fetching user projects:', err);
      res.status(500).json({ error: 'Failed to fetch user projects' });
  }
});



router.post('/', async (req, res) => {
    const { projectName,startDate, dueDate,description,status} = req.body;
    console.log(req.body);

    try {
        // Connect to MongoDB
        const client = new mongoClient(URL, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        
        // Access the 'project' database and 'projects' collection
        const db = client.db('project');
        const collection = db.collection('projects');

        // Insert project details into MongoDB
        const result = await collection.insertOne({
            projectName,
            startDate,
            dueDate,
            description,
            status,
            
        });

        // Close MongoDB connection
        await client.close();

        // Respond with the inserted project data
        res.status(200).json({message: "project created"});
    } catch (err) { 
        console.error('Error adding project:', err);
        res.status(500).json({ error: 'Failed to add project' });
    }
});
  
  // Fetch all projects
  router.get('/', async (req, res) => {
    try {
        const client = new mongoClient(URL);
        const db = client.db('project');
      const projects = await db.collection('projects').find().toArray();
      res.json(projects);
    } catch (err) {
      console.error('Error fetching projects:', err);
     
        const errorPayload = {
            message: "Server error",
            originalMessage: err.message,
            originalStatus: err.status || 500, // Assuming status is a custom field you set
        };

        res.status(500).json(errorPayload);
    }
  });

  router.get('/:id', async (req, res) => {
    try {
      const client = await mongoClient.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true });
      const db = client.db('project');
      const collection = db.collection('projects');
  
      const objId = new ObjectId(req.params.id);
      const project = await collection.findOne({ _id: objId });
  
      await client.close();
  
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
  
      res.json(project);
    } catch (error) {
      console.error('Error fetching project:', error);
      res.status(500).json({ error: 'Failed to fetch project' });
    }
  });


  router.put('/:id', async (req, res) => {
    const { projectName, dueDate, description, status } = req.body;
    const objId = new ObjectId(req.params.id);
  
    try {
      const client = await mongoClient.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true });
      const db = client.db('project');
      const collection = db.collection('projects');
  
      const updatedProject = await collection.findOneAndUpdate(
        { _id: objId },
        { $set: { projectName, dueDate, description, status } },
        { returnOriginal: false } // Ensure the updated document is returned
      );
  
      await client.close();
  
      if (!updatedProject.value) {
        return res.status(404).json({ error: 'Project not found' });
      }
  
      res.json(updatedProject.value);
    } catch (error) {
      console.error('Error updating project:', error);
      res.status(500).json({ error: 'Failed to update project' });
    }
  });




module.exports = router;