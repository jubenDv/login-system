import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // 🔹 Fetch User Info
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/"); // Redirect to login if no token
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/api/auth/user", {
          method: "GET",
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        if (response.ok) {
          // Check if user status is "deactivate"
          if (data.status === "deactivate") {
            localStorage.removeItem("token"); // Destroy the token
            navigate("/"); // Redirect to login
          } else {
            setUser(data); // Set user data if status is not "deactivate"
          }
        } else {
          localStorage.removeItem("token"); // Invalid token, remove it
          navigate("/"); // Redirect to login
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        localStorage.removeItem("token");
        navigate("/");
      }
    };

    fetchUser();
  }, [navigate]);

  // 🔹 Logout
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token
    navigate("/"); // Redirect to login
  };

  return (
    <div>
      <h2>User Dashboard</h2>
      {user ? (
        <>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Address:</strong> {user.address}</p>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default UserDashboard;