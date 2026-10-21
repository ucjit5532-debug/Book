const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();
const port = process.env.PORT || 3000;
const bookFields = [
  'bookTitle',
  'authorName',
  'imageURL',
  'category',
  'bookDescription',
  'bookPDFURL',
];

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB configuration
let client;
let bookCollections;
let routesRegistered = false;

async function connectToMongoDB() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error(
        'MONGODB_URI is not set. Add it to mern--server/.env (see .env.example) or set it in your environment.'
      );
    }

    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();

    bookCollections = client.db('bookInventory').collection('books');

    if (!routesRegistered) {
      // Insert a book into the database
      app.post('/Upload-book', async (req, res) => {
        try {
          const body = req.body;

          if (!body || typeof body !== 'object' || Array.isArray(body)) {
            return res.status(400).json({ message: 'Book data must be a JSON object' });
          }

          const missingFields = bookFields.filter(
            (field) => typeof body[field] !== 'string' || body[field].trim() === ''
          );

          if (missingFields.length > 0) {
            return res.status(400).json({
              message: `Please provide valid values for: ${missingFields.join(', ')}`,
            });
          }

          const book = Object.fromEntries(
            bookFields.map((field) => [field, body[field].trim()])
          );
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

          const body = req.body;
          if (!body || typeof body !== 'object' || Array.isArray(body)) {
            return res.status(400).json({ message: 'Book data must be a JSON object' });
          }

          const fields = Object.keys(body);
          const invalidFields = fields.filter((field) => !bookFields.includes(field));
          if (fields.length === 0 || invalidFields.length > 0) {
            return res.status(400).json({
              message:
                invalidFields.length > 0
                  ? `Unsupported book fields: ${invalidFields.join(', ')}`
                  : 'At least one book field is required',
            });
          }

          const invalidValues = fields.filter(
            (field) => typeof body[field] !== 'string' || body[field].trim() === ''
          );
          if (invalidValues.length > 0) {
            return res.status(400).json({
              message: `Please provide valid values for: ${invalidValues.join(', ')}`,
            });
          }

          const update = Object.fromEntries(
            fields.map((field) => [field, body[field].trim()])
          );
          const result = await bookCollections.updateOne(
            { _id: new ObjectId(id) },
            { $set: update }
          );

          if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Book not found' });
          }

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

      // Find books by category
      app.get('/all-books/:category', async (req, res) => {
        try {
          const category = req.params.category;
          const books = await bookCollections.find({ category }).toArray();
          res.json(books);
        } catch (error) {
          res.status(500).json({
            message: 'Failed to fetch books by category',
            error: error.message,
          });
        }
      });

      // Get a single book by id
      app.get('/book/:id', async (req, res) => {
        try {
          const { id } = req.params;

          if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid book id' });
          }

          const result = await bookCollections.findOne({ _id: new ObjectId(id) });
          if (!result) {
            return res.status(404).json({ message: 'Book not found' });
          }

          res.json(result);
        } catch (error) {
          res.status(500).json({ message: 'Failed to fetch book', error: error.message });
        }
      });

      routesRegistered = true;
    }

    console.log('You successfully connected to MongoDB!');
    return client;
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err;
  }
}

async function disconnectFromMongoDB() {
  if (client) {
    await client.close();
    client = undefined;
    bookCollections = undefined;
  }
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