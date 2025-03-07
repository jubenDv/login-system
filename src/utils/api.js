const API_URL = "http://localhost:5000/api";

// 🔹 User Authentication
export const login = async (email, password) => {
  try {
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    return await response.json();
  } catch (error) {
    return { message: "Network error. Please try again." };
  }
};


export const register = async (userData) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  return response.json();
};

export const loginAdmin = async (email, password) => {
    const response = await fetch("http://localhost:5000/api/admin/login", { 
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  };

export const logoutAdmin = () => {
    localStorage.removeItem("adminToken");
  };
  


  export const sendOTP = async (email) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      return await response.json();
    } catch (error) {
      return { message: "Error sending OTP" };
    }
  };
  

export const verifyOTP = async (email, otp, newPassword) => {
  const response = await fetch(`${API_URL}/auth/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp, newPassword }),
  });
  return response.json();
};

export const resetPassword = async (email, newPassword) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });
  
      return await response.json();
    } catch (error) {
      return { message: "Network error. Please try again." };
    }
  };
  
  
// 🔥 Admin Authentication (OTP Login)
export const sendAdminOTP = async (email) => {
  const response = await fetch(`${API_URL}/admin/send-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return response.json();
};

export const verifyAdminOTP = async (email, otp) => {
  const response = await fetch(`${API_URL}/admin/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp }),
  });
  return response.json();
};

// 🔹 Admin Dashboard Functions
export const getAllUsers = async () => {
  const response = await fetch(`${API_URL}/admin/users`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  return response.json();
};

// Activate a user
export const activateUser = async (userId) => {
    const response = await fetch(`${API_URL}/admin/activate/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    });
    return response.json();
  };
  
  // Deactivate a user
  export const deactivateUser = async (userId) => {
    const response = await fetch(`${API_URL}/admin/deactivate/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    });
    return response.json();
  };


export const deleteUser = async (userId) => {
  const response = await fetch(`${API_URL}/admin/delete/${userId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  return response.json();
};

// 🔹 Logout (Clears Admin & User Tokens)
export const logout = () => {
  localStorage.removeItem("adminToken");
  localStorage.removeItem("userToken");
};
