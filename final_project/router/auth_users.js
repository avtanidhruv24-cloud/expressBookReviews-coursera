const express = require('express');
const jwt = require('jsonwebtoken');
const books = require('./booksdb.js');
const regd_users = express.Router();

const users = [];

const isValid = (username) => typeof username === 'string' && username.trim().length > 0 &&
  !users.some((user) => user.username === username.trim());

const authenticatedUser = (username, password) => users.some(
  (user) => user.username === username && user.password === password
);

regd_users.post('/login', (req, res) => {
  const { username, password } = req.body || {};
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }
  const token = jwt.sign({ username }, process.env.JWT_SECRET || 'fingerprint_customer', { expiresIn: '1h' });
  req.session.token = token;
  return res.status(200).json({ message: 'Login successful', token });
});

regd_users.put('/auth/review/:isbn', (req, res) => {
  const book = books[req.params.isbn];
  if (!book) return res.status(404).json({ message: 'Book not found' });
  const review = req.body && req.body.review;
  if (typeof review !== 'string' || !review.trim()) {
    return res.status(400).json({ message: 'A non-empty review is required' });
  }
  book.reviews[req.user] = review.trim();
  return res.status(200).json({ message: 'Review added or updated', reviews: book.reviews });
});

regd_users.delete('/auth/review/:isbn', (req, res) => {
  const book = books[req.params.isbn];
  if (!book) return res.status(404).json({ message: 'Book not found' });
  if (!Object.prototype.hasOwnProperty.call(book.reviews, req.user)) {
    return res.status(404).json({ message: 'Review not found' });
  }
  delete book.reviews[req.user];
  return res.status(200).json({ message: 'Review deleted', reviews: book.reviews });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
