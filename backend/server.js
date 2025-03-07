const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
require("dotenv").config(); // Load environment variables

const app = express();
app.use(cors());
app.use(express.json());

// Connect to Clever Cloud MySQL
const db = mysql.createConnection({
    host: process.env.MYSQL_ADDON_HOST,         // Clever Cloud MySQL Host
    user: process.env.MYSQL_ADDON_USER,         // Clever Cloud MySQL User
    password: process.env.MYSQL_ADDON_PASSWORD, // Clever Cloud MySQL Password
    database: process.env.MYSQL_ADDON_DB,       // Clever Cloud MySQL Database Name
    port: process.env.MYSQL_ADDON_PORT || 3306  // Port (Usually 3306)
});

db.connect(err => {
    if (err) {
        console.error("❌ Database connection failed:", err);
        return;
    }
    console.log("✅ Connected to Clever Cloud MySQL!");
});

// API to handle table booking
app.post("/book-table", (req, res) => {
    const { name, email, phone, date, time, people, message } = req.body;
    const query = "INSERT INTO reservations (name, email, phone, date, time, people, message) VALUES (?, ?, ?, ?, ?, ?, ?)";
    
    db.query(query, [name, email, phone, date, time, people, message], (err, result) => {
        if (err) return res.status(500).json({ message: "❌ Booking failed" });
        res.json({ message: "✅ Table booked successfully!" });
    });
});

// Start Server
app.listen(5000, () => {
    console.log("🚀 Server running on http://localhost:5000");
});
