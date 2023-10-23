const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Predicate function to return property value comparison based on the ISBN
const isPropertyInBooks = (property, _value, _ISBN) => {
  return (value, ISBN) => {
    let contextProperty = property;
    if (contextProperty && ISBN) {
      return books[ISBN][contextProperty].toLowerCase() === value.toLowerCase();
    }
    return false;
  }
};

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered." })
    } else {
      return res.status(409).json({ message: "User already exists!" });
    }
  }
  return res.status(400).json({ message: "Invalid user or password" });

});

// Get a Promise for all books;
const getAllBooks = () => {
  const simulatedDelay = 1000;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(books)
    }, simulatedDelay);
  })
}


// Get the book list available in the shop
public_users.get('/', async (_req, res) => {
  let books = null;
  try {
    books = await getAllBooks();
  } catch (error) {
    console.log(error);
    return res.status(500);

  }
  return res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const ISBN = req.params.isbn;
  const booksHasISBN = books.hasOwnProperty(ISBN);
  if (ISBN && booksHasISBN) {
    return res.send(JSON.stringify(books[ISBN], null, 4));
  } else {
    return res.status(404).send("ISBN not found");
  }

});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const booksFromAuthor = {};
  const isAuthorOfBook = isPropertyInBooks("author");

  for (const ISBN in books) {
    if (isAuthorOfBook(author, ISBN)) {
      booksFromAuthor[ISBN] = books[ISBN];
    }
  }
  return res.json(booksFromAuthor);
});


// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const booksWithTitle = {};
  const isTitleOfBook = isPropertyInBooks("title");

  for (let ISBN in books) {
    if (isTitleOfBook(title, ISBN)) {
      booksWithTitle[ISBN] = books[ISBN];
    }
  }
  return res.json(booksWithTitle);
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const bookReviews = {};

  for (let ISBN in books) {
    if (ISBN === isbn) {
      bookReviews[ISBN] = books[isbn].reviews;
    }
  }

  res.send(bookReviews);

});

module.exports.general = public_users;
