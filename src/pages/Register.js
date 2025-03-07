import React, { useState } from "react";
import { register } from "../utils/api";
import ReCAPTCHA from "react-google-recaptcha"; // Import reCAPTCHA

const Register = () => {
  const [formData, setFormData] = useState({ email: "", name: "", address: "", contact_number: "", password: "" });
  const [message, setMessage] = useState("");
  const [captchaValue, setCaptchaValue] = useState(null); // Store CAPTCHA value

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if CAPTCHA is verified
    if (!captchaValue) {
      setMessage("Please verify that you are not a robot.");
      return;
    }

    // Proceed with registration if CAPTCHA is solved
    const data = await register(formData);
    setMessage(data.message);
  };

  return (
    <div>
      <h2>Register</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
        <input type="text" name="address" placeholder="Address" onChange={handleChange} required />
        <input type="text" name="contact_number" placeholder="Contact Number" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        
        {/* Add reCAPTCHA widget */}
        <ReCAPTCHA
          sitekey="6Lc6XewqAAAAAJSYeO3eZmpyMT5ztZLt86pG0umx" // Replace with your actual site key
          onChange={(value) => setCaptchaValue(value)} // Store the CAPTCHA response
        />

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
