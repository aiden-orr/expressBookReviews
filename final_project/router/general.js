const express = require("express");
const axios = require("axios");
const books = require("./booksdb.js");
const { isValid, users } = require("./auth_users.js");

const public_users = express.Router();

// Task 6: Register a new user
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required"
        });
    }

    if (!isValid(username)) {
        return res.status(409).json({
            message: "Username already exists"
        });
    }

    users.push({ username, password });

    return res.status(200).json({
        message: "User successfully registered. Now you can login"
    });
});

// Task 1: Get all books
public_users.get("/", (req, res) => {
    return res.status(200).json(books);
});

// Task 2: Get books by ISBN
public_users.get("/isbn/:isbn", (req, res) => {
    const book = books[req.params.isbn];

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    return res.status(200).json(book);
});

// Task 3: Get books by author
public_users.get("/author/:author", (req, res) => {
    const author = req.params.author.toLowerCase();

    const results = Object.values(books).filter(
        book => book.author.toLowerCase() === author
    );

    return res.status(200).json(results);
});

// Task 4: Get books by title
public_users.get("/title/:title", (req, res) => {
    const title = req.params.title.toLowerCase();

    const results = Object.values(books).filter(
        book => book.title.toLowerCase() === title
    );

    return res.status(200).json(results);
});

// Task 5: Get book reviews
public_users.get("/review/:isbn", (req, res) => {
    const book = books[req.params.isbn];

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    return res.status(200).json(book.reviews);
});

// Task 10: Asynchronous Axios methods
const BASE_URL = "http://localhost:5000";

// Get all books using async/await
async function getAllBooks() {
    const response = await axios.get(`${BASE_URL}/`);
    return response.data;
}

// Get books by ISBN using Promises
function getBookByISBN(isbn) {
    return axios.get(`${BASE_URL}/isbn/${isbn}`)
        .then(response => response.data);
}

// Get books by author using Promises
function getBooksByAuthor(author) {
    return axios.get(
        `${BASE_URL}/author/${encodeURIComponent(author)}`
    ).then(response => response.data);
}

// Get books by title using Promises
function getBooksByTitle(title) {
    return axios.get(
        `${BASE_URL}/title/${encodeURIComponent(title)}`
    ).then(response => response.data);
}

module.exports.general = public_users;
module.exports.getAllBooks = getAllBooks;
module.exports.getBookByISBN = getBookByISBN;
module.exports.getBooksByAuthor = getBooksByAuthor;
module.exports.getBooksByTitle = getBooksByTitle;