const express = require("express");
const jwt = require("jsonwebtoken");
const session = require("express-session");

const customer_routes = require("./router/auth_users.js").authenticated;
const genl_routes = require("./router/general.js").general;
const JWT_SECRET = require("./router/auth_users.js").JWT_SECRET;

const app = express();

app.use(express.json());

app.use("/customer", session({
    secret: process.env.SESSION_SECRET || "fingerprint_customer",
    resave: false,
    saveUninitialized: false
}));

// Authentication middleware
app.use("/customer/auth", (req, res, next) => {
    const authorization = req.session.authorization;

    if (!authorization) {
        return res.status(401).json({
            message: "Please login first"
        });
    }

    jwt.verify(
        authorization.accessToken,
        JWT_SECRET,
        (err, decoded) => {
            if (err) {
                return res.status(403).json({
                    message: "Invalid or expired token"
                });
            }

            req.user = decoded;
            next();
        }
    );
});

app.use("/customer", customer_routes);
app.use("/", genl_routes);

const PORT = 5000;

app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
});