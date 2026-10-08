const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB configuration
const client = new MongoClient(
  'mongodb+srv://mern-book-store:FEdwbwOgrfvfbTJN@cluster0.qwhdt0y.mongodb.net/?appName=Cluster0'
);

async function connectToMongoDB() {
  try {
    await client.connect();

    const bookCollections = client.db('bookInventory').collection('books');

    // Insert a book into the database
    app.post('/Upload-book', async (req, res) => {
      try {
        const book = req.body;

        if (!book || Object.keys(book).length === 0) {
          return res.status(400).json({ message: 'Book data is required' });
        }

        const result = await bookCollections.insertOne(book);
        res.status(201).json({
          message: 'Book uploaded successfully',
          bookId: result.insertedId,
        });
      } catch (error) {
        res.status(500).json({ message: 'Failed to upload book', error: error.message });
      }
    });

    // Get all books from the database
    app.get('/all-books', async (req, res) => {
      try {
        const books = await bookCollections.find().toArray();
        res.json(books);
      } catch (error) {
        res.status(500).json({ message: 'Failed to fetch books', error: error.message });
      }
    });

    // Update a book by id
    app.patch('/book/:id', async (req, res) => {
      try {
        const id = req.params.id;

        if (!ObjectId.isValid(id)) {
          return res.status(400).json({ message: 'Invalid book id' });
        }

        const updatedBookData = req.body;
        const filter = { _id: new ObjectId(id) };
        const options = { upsert: true };
        const updateDoc = { $set: { ...updatedBookData } };

        const result = await bookCollections.updateOne(filter, updateDoc, options);

        res.json({
          message: 'Book updated successfully',
          matchedCount: result.matchedCount,
          modifiedCount: result.modifiedCount,
        });
      } catch (error) {
        res.status(500).json({ message: 'Failed to update book', error: error.message });
      }
    });

    // Delete a book by id
    app.delete('/book/:id', async (req, res) => {
      try {
        const id = req.params.id;

        if (!ObjectId.isValid(id)) {
          return res.status(400).json({ message: 'Invalid book id' });
        }

        const filter = { _id: new ObjectId(id) };
        const result = await bookCollections.deleteOne(filter);

        if (result.deletedCount === 0) {
          return res.status(404).json({ message: 'Book not found' });
        }

        res.json({ message: 'Book deleted successfully' });
      } catch (error) {
        res.status(500).json({ message: 'Failed to delete book', error: error.message });
      }
    });

    //find by category
    app.get('/all-books/:category', async (req, res) => {
      try {
        const category = req.params.category;
        const books = await bookCollections.find({ category }).toArray();
        res.json(books);
      } catch (error) {
        res.status(500).json({ message: 'Failed to fetch books by category', error: error.message });
      }
    });

    //single book data
    app.get("/book/:id", async (req,res) => {
      const id = req.params.id;
      const filter = {_id:new ObjectId(id)};
      const result = await bookCollections.findOne(filter);
      res.send(result);


       
    })


    console.log('You successfully connected to MongoDB!');
    return client;
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err;
  }
}

async function disconnectFromMongoDB() {
  await client.close();
}

app.get('/', (req, res) => {
  res.send('Hello World');
});

connectToMongoDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Server failed to start:', err);
    process.exit(1);
  });

module.exports = {
  app,
  connectToMongoDB,
  disconnectFromMongoDB,
};