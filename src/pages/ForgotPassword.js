import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendOTP, verifyOTP, resetPassword } from "../utils/api"; // Import API functions
import ReCAPTCHA from "react-google-recaptcha"; // Import reCAPTCHA

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [message, setMessage] = useState("");
  const [captchaValue, setCaptchaValue] = useState(null); // Store CAPTCHA value
  const navigate = useNavigate();

  // Step 1: Send OTP
  const handleSendOTP = async () => {
    if (!captchaValue) {
      setMessage("Please verify that you are not a robot.");
      return;
    }

    const response = await sendOTP(email);
    if (response.message.includes("OTP sent")) {
      setStep(2);
      setMessage("OTP sent to your email.");
    } else {
      setMessage(response.message);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async () => {
    const response = await verifyOTP(email, otp);
    if (response.message.includes("OTP verified")) {
      setStep(3);
      setMessage("OTP verified! Enter your new password.");
    } else {
      setMessage(response.message);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async () => {
    const response = await resetPassword(email, newPassword);
    if (response.message.includes("Password reset successful")) {
      setMessage("Password reset successful! Redirecting to login...");
      setTimeout(() => {
        navigate("/"); // Redirect to login page
      }, 1000);
    } else {
      setMessage(response.message);
    }
  };

  return (
    <div>
      <h2>Forgot Password</h2>
      {message && <p>{message}</p>}

      {step === 1 && (
        <>
          <input
            type="email"
            placeholder="Enter your email"
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
            placeholder="Enter New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button onClick={handleResetPassword}>Reset Password</button>
        </>
      )}
    </div>
  );
};

export default ForgotPassword;
