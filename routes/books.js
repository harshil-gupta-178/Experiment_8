const express = require('express');
const router = express.Router();

let books = [
  {
    id: 1,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    genre: "Fiction",
    year: 1960
  },
  {
    id: 2,
    title: "1984",
    author: "George Orwell",
    genre: "Dystopian",
    year: 1949
  },
  {
    id: 3,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    genre: "Classic",
    year: 1925
  }
];

const getNextId = () => {
  return books.length > 0 ? Math.max(...books.map(b => b.id)) + 1 : 1;
};

router.get('/', (req, res) => {
  const { author, genre } = req.query;
  let result = books;

  if (author) {
    result = result.filter(b => b.author.toLowerCase().includes(author.toLowerCase()));
  }
  if (genre) {
    result = result.filter(b => b.genre.toLowerCase() === genre.toLowerCase());
  }

  res.status(200).json({
    success: true,
    count: result.length,
    data: result
  });
});

router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid book ID. ID must be an integer.'
    });
  }

  const book = books.find(b => b.id === id);
  if (!book) {
    return res.status(404).json({
      success: false,
      message: `Book with ID ${id} not found.`
    });
  }

  res.status(200).json({
    success: true,
    data: book
  });
});

router.post('/', (req, res) => {
  const { title, author, genre, year } = req.body;

  if (!title || typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error: "title" is required and must be a non-empty string.'
    });
  }

  if (!author || typeof author !== 'string' || !author.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error: "author" is required and must be a non-empty string.'
    });
  }

  const newBook = {
    id: getNextId(),
    title: title.trim(),
    author: author.trim(),
    genre: genre ? String(genre).trim() : 'General',
    year: year ? parseInt(year, 10) : new Date().getFullYear()
  };

  books.push(newBook);

  res.status(201).json({
    success: true,
    message: 'Book created successfully.',
    data: newBook
  });
});

router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid book ID. ID must be an integer.'
    });
  }

  const bookIndex = books.findIndex(b => b.id === id);
  if (bookIndex === -1) {
    return res.status(404).json({
      success: false,
      message: `Book with ID ${id} not found.`
    });
  }

  const { title, author, genre, year } = req.body;

  if (title !== undefined) {
    if (typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error: "title" must be a non-empty string.'
      });
    }
    books[bookIndex].title = title.trim();
  }

  if (author !== undefined) {
    if (typeof author !== 'string' || !author.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error: "author" must be a non-empty string.'
      });
    }
    books[bookIndex].author = author.trim();
  }

  if (genre !== undefined) {
    books[bookIndex].genre = String(genre).trim();
  }

  if (year !== undefined) {
    books[bookIndex].year = parseInt(year, 10);
  }

  res.status(200).json({
    success: true,
    message: `Book with ID ${id} updated successfully.`,
    data: books[bookIndex]
  });
});

router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid book ID. ID must be an integer.'
    });
  }

  const bookIndex = books.findIndex(b => b.id === id);
  if (bookIndex === -1) {
    return res.status(404).json({
      success: false,
      message: `Book with ID ${id} not found.`
    });
  }

  const deletedBook = books.splice(bookIndex, 1)[0];

  res.status(200).json({
    success: true,
    message: `Book with ID ${id} deleted successfully.`,
    data: deletedBook
  });
});

module.exports = router;
