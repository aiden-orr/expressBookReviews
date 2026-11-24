const express = require("express");
const jwt = require("jsonwebtoken");
const books = require("./booksdb.js");

const regd_users = express.Router();
const users = [];

const JWT_SECRET = process.env.JWT_SECRET || "book_review_secret";

const isValid = (username) => {
    return !users.some(user => user.username === username);
};

const authenticatedUser = (username, password) => {
    return users.some(user =>
        user.username === username &&
        user.password === password
    );
};

// Task 7: Login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!authenticatedUser(username, password)) {
        return res.status(401).json({
            message: "Invalid username or password"
        });
    }

    const token = jwt.sign(
        { username },
        JWT_SECRET,
        { expiresIn: "1h" }
    );

    req.session.authorization = {
        accessToken: token,
        username: username
    };

    return res.status(200).json({
        message: "Login successful"
    });
});

// Task 8: Add or modify a review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.user.username;
    const review = req.query.review || req.body.review;

    if (!books[isbn]) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    if (!review) {
        return res.status(400).json({
            message: "Review is required"
        });
    }

    books[isbn].reviews[username] = review;

    return res.status(200).json({
        message: "Review successfully added or updated",
        reviews: books[isbn].reviews
    });
});

// Task 9: Delete a review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.user.username;

    if (!books[isbn]) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    if (!Object.hasOwn(books[isbn].reviews, username)) {
        return res.status(404).json({
            message: "Review not found"
        });
    }

    delete books[isbn].reviews[username];

    return res.status(200).json({
        message: "Review successfully deleted",
        reviews: books[isbn].reviews
    });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
module.exports.JWT_SECRET = JWT_SECRET;