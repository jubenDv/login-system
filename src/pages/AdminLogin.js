import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // For redirection
import { sendAdminOTP, verifyAdminOTP, loginAdmin } from "../utils/api"; // Import API functions
import ReCAPTCHA from "react-google-recaptcha"; // Import reCAPTCHA

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Password
  const [message, setMessage] = useState("");
  const [captchaValue, setCaptchaValue] = useState(null); // Store CAPTCHA value
  const navigate = useNavigate();

  // Step 1: Send OTP
  const handleSendOTP = async () => {
    if (!captchaValue) {
      setMessage("Please verify that you are not a robot.");
      return;
    }

    const response = await sendAdminOTP(email);
    if (response.message === "OTP sent successfully!") {
      setStep(2); // Move to OTP input step
      setMessage("OTP sent to your email.");
    } else {
      setMessage(response.message);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async () => {
    const response = await verifyAdminOTP(email, otp);
    console.log("OTP Verification Response:", response); // Debugging

    if (response.message.includes("OTP verified")) { // Flexible check
      setStep(3); // Move to password input step
      setMessage("OTP verified! Enter your password.");
    } else {
      setMessage(response.message);
    }
  };

  // Step 3: Enter Password and Login
  const handleLogin = async () => {
    const response = await loginAdmin(email, password);
    if (response.token) {
      localStorage.setItem("adminToken", response.token); // Save admin session
      setMessage("Login successful! Redirecting...");
      setTimeout(() => {
        navigate("/admin-dashboard"); // Redirect to Admin Dashboard
      }, 1000);
    } else {
      setMessage(response.message);
    }
  };

  return (
    <div>
      <h2>Admin Login</h2>
      {message && <p>{message}</p>}

      {step === 1 && (
        <>
          <input
            type="email"
            placeholder="Enter Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          
          {/* Add reCAPTCHA widget */}
          <ReCAPTCHA
            sitekey="6Lc6XewqAAAAAJSYeO3eZmpyMT5ztZLt86pG0umx" // Replace with your actual site key
            onChange={(value) => setCaptchaValue(value)} // Store the CAPTCHA response
          />

          <button onClick={handleSendOTP}>Send OTP</button>
        </>
      )}

      {step === 2 && (
        <>
          <p>OTP sent to {email}</p>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={handleVerifyOTP}>Verify OTP</button>
        </>
      )}

      {step === 3 && (
        <>
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleLogin}>Login</button>
        </>
      )}
    </div>
  );
};

export default AdminLogin;
