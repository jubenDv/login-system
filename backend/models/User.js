const db = require("../config/db");

const User = {
  createUser: (userData, callback) => {
    const sql = "INSERT INTO users SET ?";
    db.query(sql, userData, callback);
  },

  getUserByEmail: (email, callback) => {
    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], callback);
  },

  updateUserOTP: (email, otp, expiry, callback) => {
    const sql = "UPDATE users SET otp_code = ?, otp_expiry = ? WHERE email = ?";
    db.query(sql, [otp, expiry, email], callback);
  },

  verifyOTP: (email, otp, callback) => {
    const sql = "SELECT * FROM users WHERE email = ? AND otp_code = ? AND otp_expiry > NOW()";
    db.query(sql, [email, otp], callback);
  },

  updatePassword: (email, newPassword, callback) => {
    const sql = "UPDATE users SET password_hash = ? WHERE email = ?";
    db.query(sql, [newPassword, email], callback);
  },
};

module.exports = User;
