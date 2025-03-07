const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const User = require("../models/User");
const db = require("../config/db"); // Ensure correct DB connection

const router = express.Router();
const OTPStore = {}; // Temporary OTP storage (use a database in production)

// Middleware to verify JWT token
const authenticate = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded user info to request
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token." });
  }
};

router.post("/register", (req, res) => {
    const { email, name, address, contact_number, password } = req.body;

    if (!email || !name || !address || !contact_number || !password) {
        return res.status(400).json({ message: "All fields are required." });
    }

    // Check if the email is already registered
    const checkEmailSql = "SELECT * FROM users WHERE email = ?";
    db.query(checkEmailSql, [email], async (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Database error" });
        }

        // If the email is already registered, return an error
        if (results.length > 0) {
            return res.status(400).json({ message: "Email is already registered." });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user
        const createUserSql = `
            INSERT INTO users (email, name, address, contact_number, password_hash)
            VALUES (?, ?, ?, ?, ?)
        `;
        db.query(
            createUserSql,
            [email, name, address, contact_number, hashedPassword],
            (err, result) => {
                if (err) {
                    console.error("Error creating user:", err);
                    return res.status(500).json({ message: "Registration failed." });
                }

                res.json({ message: "Registration successful. Waiting to be activate." });
            }
        );
    });
});

// 🔹 Get User Info (Protected Route)
router.get("/user", authenticate, (req, res) => {
  const userId = req.user.id;

  db.query("SELECT * FROM users WHERE id = ?", [userId], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });

    if (results.length === 0) return res.status(404).json({ message: "User not found" });

    res.json(results[0]); // Return user details
  });
});

router.post("/send-otp", (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    // Check if the email exists in the 'users' table
    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Database error" });
        }

        // If no user is found with the provided email, return an error
        if (results.length === 0) {
            return res.status(400).json({ message: "Email is not registered." });
        }

        // Generate a 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000);
        OTPStore[email] = { otp, expires: Date.now() + 10 * 60 * 1000 }; // 10 min expiry

        // Setup Nodemailer Transporter
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password Reset OTP",
            text: `Your OTP code is: ${otp}. It expires in 10 minutes.`,
        };

        // Send the OTP via email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending OTP:", error);
                return res.status(500).json({ message: "Failed to send OTP", error: error.message });
            }

            res.json({ message: "OTP sent successfully!" });
        });
    });
});

// 🔹 Verify OTP for Password Reset
router.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }

  if (OTPStore[email] && OTPStore[email].otp === parseInt(otp) && OTPStore[email].expires > Date.now()) {
    delete OTPStore[email]; // Remove OTP after successful verification
    res.json({ message: "OTP verified! Enter your new password." });
  } else {
    res.status(400).json({ message: "Invalid or expired OTP" });
  }
});

// 🔹 Reset Password
router.post("/reset-password", async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ message: "Email and new password are required" });
  }

  try {
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password in the database
    const sql = "UPDATE users SET password_hash = ? WHERE email = ?";
    db.query(sql, [hashedPassword, email], (err, result) => {
      if (err) return res.status(500).json({ message: "Database error" });

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ message: "Password reset successful!" });
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], async (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Database error" });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const user = results[0];

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Check if the account approval
        if (user.status === "deactivate") {
            return res.status(403).json({ message: "Your account is deactivate. Please wait for activation." });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ token, message: "Login successful!" });
    });
});

module.exports = router;
