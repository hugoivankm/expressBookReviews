const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValidISBN = (ISBN) => {
  return books.hasOwnProperty(ISBN);
}

const isValid = (username) => {
  let usersWithSameName = users.filter((user) => {
    return user.username === username;
  });
  if (usersWithSameName.length > 0) {
    return true;
  } else {
    return false;
  }
}


const authenticatedUser = (username, password) => {
  const validUsers = users.filter((user) => {
    return (user.username === username && user.password === password);
  });

  if (validUsers.length > 0) {
    return true;
  } else {
    return false;
  }

}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(401).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    const accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,
      username
    }
    return res.send("User Successfully logged in");
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username or password" });
  }

});


// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const ISBN = req.params.isbn;
  const username = req.session.authorization.username;
  const newReview = req.body.review;



  if (isValidISBN(ISBN)) {
    if (newReview) {
      books[ISBN].reviews[username] = newReview;
    } else {
      return res.status(400).json({ message: "Empty review" })
    }
  
  } else {
    return res.status(404).json({ message: "ISBN not found" });
  }

  return res.status(202).json({ message: "Review Succussfully Added" })
});


regd_users.delete("/auth/review/:isbn", (req, res) => {  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
