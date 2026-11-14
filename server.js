const express = require('express');
const path = require('path');
const booksRouter = require('./routes/books');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
});

app.use('/api/books', booksRouter);

app.use(express.static(path.join(__dirname, 'html')));
app.use(express.static(path.join(__dirname)));

app.get('/api', (req, res) => {
  res.status(200).json({
    message: 'Welcome to the Book Collection RESTful API (Experiment 8)',
    endpoints: {
      'GET /api/books': 'Retrieve all books (supports ?author= & ?genre= query filters)',
      'GET /api/books/:id': 'Retrieve a specific book by ID',
      'POST /api/books': 'Add a new book (Body: { title, author, genre?, year? })',
      'PUT /api/books/:id': 'Update an existing book by ID (Body: { title?, author?, genre?, year? })',
      'DELETE /api/books/:id': 'Delete a book by ID'
    }
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl} - Route not found`
  });
});

app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: err.message
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`=================================================`);
    console.log(` Book Collection API Server running at:`);
    console.log(` http://localhost:${PORT}`);
    console.log(` Web Frontend:         http://localhost:${PORT}/`);
    console.log(` REST API Base:        http://localhost:${PORT}/api/books`);
    console.log(`=================================================`);
  });
}

module.exports = app;
