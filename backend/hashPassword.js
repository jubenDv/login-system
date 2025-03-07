// backend/hashPassword.js
const bcrypt = require("bcrypt");

// Plaintext password to hash
const plaintextPassword = "juben"; // Replace with your desired password

// Hash the password
bcrypt.hash(plaintextPassword, 10, (err, hashedPassword) => {
  if (err) {
    console.error("Error hashing password:", err);
    return;
  }

  // Print the hashed password to the terminal
  console.log("Plaintext Password:", plaintextPassword);
  console.log("Hashed Password:", hashedPassword);
});