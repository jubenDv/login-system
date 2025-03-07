// utils/captchaVerification.js
const axios = require("axios");

const verifyCaptcha = async (captchaResponse) => {
  const secretKey = "your-secret-key"; // Replace with your secret key
  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captchaResponse}`;

  try {
    const result = await axios.post(url);
    return result.data.success; // Return true if CAPTCHA is valid
  } catch (error) {
    console.error("Captcha verification failed", error);
    return false;
  }
};

module.exports = { verifyCaptcha };
