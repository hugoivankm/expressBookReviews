const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const isPropertyInBooks = (property, _value, _ISBN) => {
    return (value, ISBN) => {
      let contextProperty = property;
      if (contextProperty && ISBN) {
        return books[ISBN][contextProperty].toLowerCase() === value.toLowerCase();
      }
      return false;
    }
}

public_users.post("/register", (_req, res) => {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});


// Get the book list available in the shop
public_users.get('/', function (_req, res) {
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
    console.log(isAuthorOfBook(author, ISBN));
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

  for (const ISBN in books) {
    if (isTitleOfBook(title, ISBN)) {
      booksWithTitle[ISBN] = books[ISBN];
    }
  }
  return res.json(booksWithTitle);
});

//  Get book review
public_users.get('/review/:isbn', function (_req, res) {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.general = public_users;
