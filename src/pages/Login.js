import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../utils/api"; // Import login function
import ReCAPTCHA from "react-google-recaptcha"; // Import reCAPTCHA

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(""); // Show messages
  const [captchaValue, setCaptchaValue] = useState(null); // Store CAPTCHA value
  const navigate = useNavigate();

  const handleLogin = async () => {
    // Check if CAPTCHA is verified
    if (!captchaValue) {
      setMessage("Please verify that you are not a robot.");
      return;
    }

    // Proceed with login if CAPTCHA is solved
    const response = await login(email, password);

    if (response.token) {
      localStorage.setItem("token", response.token); // Save token in localStorage
      setMessage("Login successful! Redirecting...");
      setTimeout(() => navigate("/user-dashboard"), 2000); // Redirect after login
    } else {
      setMessage(response.message || "Invalid credentials.");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {message && <p>{message}</p>}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      {/* Add reCAPTCHA widget */}
      <ReCAPTCHA
        sitekey="6Lc6XewqAAAAAJSYeO3eZmpyMT5ztZLt86pG0umx" // Replace with your actual site key
        onChange={(value) => setCaptchaValue(value)} // Store the CAPTCHA response
      />

      <button onClick={handleLogin}>Login</button>

      <p>
        <a onClick={() => navigate("/register")}>Register</a> | 
        <a onClick={() => navigate("/forgot-password")}> Forgot Password?</a>
      </p>
    </div>
  );
};

export default Login;
