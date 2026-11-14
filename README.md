# Experiment 8: Build a Simple RESTful API using Node.js and Express.js

## Aim / Objective
To design and implement a simple RESTful API using **Node.js** and **Express.js** for managing a collection of books, supporting full **CRUD** (Create, Read, Update, Delete) operations with proper HTTP status codes, request validations, and JSON responses.

---

## Theory & Concepts

### 1. What is a RESTful API?
**REST** (Representational State Transfer) is an architectural style for designing networked applications. A RESTful API uses HTTP requests to access and manipulate data.
Key principles include:
- **Statelessness**: Every request from client to server must contain all necessary information; the server does not store client session context.
- **Client-Server Separation**: The user interface and data storage concerns are separated.
- **Uniform Interface**: Resources are identified in requests (URIs) and manipulated using standard HTTP verbs.

### 2. HTTP Verbs & CRUD Operations
| CRUD Operation | HTTP Method | Endpoint | Description | Expected Status |
|---|---|---|---|---|
| **Read (All)** | `GET` | `/api/books` | Retrieve list of all books | `200 OK` |
| **Read (One)** | `GET` | `/api/books/:id` | Retrieve a single book by ID | `200 OK` / `404 Not Found` |
| **Create** | `POST` | `/api/books` | Add a new book to the collection | `201 Created` / `400 Bad Request` |
| **Update** | `PUT` | `/api/books/:id` | Update details of an existing book | `200 OK` / `400 Bad Request` / `404 Not Found` |
| **Delete** | `DELETE` | `/api/books/:id` | Remove a book from the collection | `200 OK` / `404 Not Found` |

### 3. HTTP Status Codes Used
- `200 OK`: Request succeeded.
- `201 Created`: Resource created successfully.
- `400 Bad Request`: Validation failure (missing required title/author or invalid ID).
- `404 Not Found`: Resource with requested ID does not exist.
- `500 Internal Server Error`: Unhandled server-side error.

---

## Project Structure

```text
Experiments_7/
├── package.json          # Project metadata, dependencies and scripts
├── server.js             # Main entry point: Express app, middleware, port listener
├── routes/
│   └── books.js          # REST routes & controller logic for book CRUD operations
├── test-api.js           # Automated end-to-end test script
└── README.md             # Lab report documentation and execution guide
```

---

## Prerequisites
- **Node.js** (v18.x or higher)
- **npm** (Node Package Manager)

---

## Installation & Setup

1. **Clone or navigate to the project directory:**
   ```powershell
   cd c:\Users\ASUS\Pictures\Experiments_7
   ```

2. **Install dependencies:**
   ```powershell
   npm install
   ```

3. **Start the API Server:**
   ```powershell
   npm start
   ```
   *The server runs at: `http://localhost:3000`*

4. **Run Automated Tests (Optional):**
   ```powershell
   npm test
   ```

---

## API Endpoints Specification

### 1. Get All Books
- **URL:** `GET /api/books`
- **Query Parameters (Optional):**
  - `author` (string): Filter books by author name (case-insensitive substring match)
  - `genre` (string): Filter books by genre
- **Response (`200 OK`):**
  ```json
  {
    "success": true,
    "count": 3,
    "data": [
      {
        "id": 1,
        "title": "To Kill a Mockingbird",
        "author": "Harper Lee",
        "genre": "Fiction",
        "year": 1960
      },
      {
        "id": 2,
        "title": "1984",
        "author": "George Orwell",
        "genre": "Dystopian",
        "year": 1949
      }
    ]
  }
  ```

---

### 2. Get Book by ID
- **URL:** `GET /api/books/:id`
- **Example:** `GET /api/books/1`
- **Response (`200 OK`):**
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "title": "To Kill a Mockingbird",
      "author": "Harper Lee",
      "genre": "Fiction",
      "year": 1960
    }
  }
  ```
- **Error Response (`404 Not Found`):**
  ```json
  {
    "success": false,
    "message": "Book with ID 999 not found."
  }
  ```

---

### 3. Add a New Book
- **URL:** `POST /api/books`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "title": "The Pragmatic Programmer",
    "author": "Andrew Hunt, David Thomas",
    "genre": "Technology",
    "year": 1999
  }
  ```
- **Response (`201 Created`):**
  ```json
  {
    "success": true,
    "message": "Book created successfully.",
    "data": {
      "id": 4,
      "title": "The Pragmatic Programmer",
      "author": "Andrew Hunt, David Thomas",
      "genre": "Technology",
      "year": 1999
    }
  }
  ```
- **Validation Error (`400 Bad Request`):**
  ```json
  {
    "success": false,
    "message": "Validation Error: \"title\" is required and must be a non-empty string."
  }
  ```

---

### 4. Update an Existing Book
- **URL:** `PUT /api/books/:id`
- **Headers:** `Content-Type: application/json`
- **Example:** `PUT /api/books/1`
- **Request Body (Partial or full update):**
  ```json
  {
    "genre": "Classic Literature",
    "year": 1961
  }
  ```
- **Response (`200 OK`):**
  ```json
  {
    "success": true,
    "message": "Book with ID 1 updated successfully.",
    "data": {
      "id": 1,
      "title": "To Kill a Mockingbird",
      "author": "Harper Lee",
      "genre": "Classic Literature",
      "year": 1961
    }
  }
  ```

---

### 5. Delete a Book
- **URL:** `DELETE /api/books/:id`
- **Example:** `DELETE /api/books/2`
- **Response (`200 OK`):**
  ```json
  {
    "success": true,
    "message": "Book with ID 2 deleted successfully.",
    "data": {
      "id": 2,
      "title": "1984",
      "author": "George Orwell",
      "genre": "Dystopian",
      "year": 1949
    }
  }
  ```

---

## Testing with PowerShell / cURL

### Fetch All Books:
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/books" -Method GET | ConvertTo-Json -Depth 3
```

### Create a New Book:
```powershell
$body = @{
    title = "Design Patterns"
    author = "Erich Gamma"
    genre = "Computer Science"
    year = 1994
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/books" -Method POST -Body $body -ContentType "application/json" | ConvertTo-Json
```

### Update a Book:
```powershell
$updateBody = @{
    genre = "Software Architecture"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/books/4" -Method PUT -Body $updateBody -ContentType "application/json" | ConvertTo-Json
```

### Delete a Book:
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/books/4" -Method DELETE | ConvertTo-Json
```

---

## Conclusion
A clean, modular RESTful API for managing a book collection was successfully developed using Node.js and Express.js. All CRUD operations (Create, Read, Update, Delete) along with input validation and HTTP status codes were implemented and verified through automated test suites.
