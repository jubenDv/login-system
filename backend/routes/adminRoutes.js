const express = require("express");
const nodemailer = require("nodemailer");
const db = require("../config/db"); // Ensure this points to your database connection
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const router = express.Router();
const OTPStore = {}; // Temporary storage for OTPs (Use a database in production)

router.post("/send-otp", (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    // Check if the email exists in the 'admins' table
    const sql = "SELECT * FROM admins WHERE email = ?";
    db.query(sql, [email], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Database error" });
        }

        // If no admin is found with the provided email, return an error
        if (results.length === 0) {
            return res.status(400).json({ message: "Email is not registered as an admin." });
        }

        // Generate a 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000);
        OTPStore[email] = otp;

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
            subject: "Admin OTP Verification",
            text: `Your OTP code is: ${otp}`,
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

// 🔹 Verify Admin OTP
router.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }

  if (OTPStore[email] && OTPStore[email] === parseInt(otp)) {
    delete OTPStore[email]; // Remove OTP after successful verification
    res.json({ message: "OTP verified! You can now log in." });
  } else {
    res.status(400).json({ message: "Invalid or expired OTP" });
  }
});

router.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    const sql = "SELECT * FROM admins WHERE email = ?";
    db.query(sql, [email], async (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Database error" });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const admin = results[0];

        // Compare password
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Generate JWT token
        const token = jwt.sign({ id: admin.id, email: admin.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ token, message: "Login successful!" });
    });
});

  router.get("/users", (req, res) => {
    const sql = "SELECT id, name, email, address, contact_number, status FROM users WHERE role = 'user'";
  
    db.query(sql, (err, results) => {
      if (err) {
        console.error("Database error:", err); // Debugging
        return res.status(500).json({ message: "Database error" });
      }
      res.json(results);
    });
  });
  
  router.put("/activate/:id", (req, res) => {
    const userId = req.params.id;
    const sql = "UPDATE users SET status = 'activate' WHERE id = ?";
  
    db.query(sql, [userId], (err, result) => {
      if (err) return res.status(500).json({ message: "Database error" });
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ message: "User approved successfully" });
    });
  });  

  router.put("/deactivate/:id", (req, res) => {
    const userId = req.params.id;
    const sql = "UPDATE users SET status = 'deactivate' WHERE id = ?";
  
    db.query(sql, [userId], (err, result) => {
      if (err) return res.status(500).json({ message: "Database error" });
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ message: "User approved successfully" });
    });
  });  

  router.delete("/delete/:id", (req, res) => {
    const userId = req.params.id;
    const sql = "DELETE FROM users WHERE id = ?";
  
    db.query(sql, [userId], (err, result) => {
      if (err) return res.status(500).json({ message: "Database error" });
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ message: "User deleted successfully" });
    });
  });  


module.exports = router;
