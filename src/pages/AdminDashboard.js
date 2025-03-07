import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllUsers, activateUser, deactivateUser, deleteUser, logoutAdmin } from "../utils/api";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  // 🔹 Check if adminToken exists in localStorage
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin-login"); // Redirect to login if no token is found
    } else {
      fetchUsers(); // If token exists, fetch the users
    }
  }, [navigate]); // Run on mount and when navigate changes

  const fetchUsers = async () => {
    const data = await getAllUsers();
    if (Array.isArray(data)) {
      setUsers(data); // Directly set users since API returns an array
    } else {
      console.error("Error fetching users");
    }
  };

  const handleActivate = async (userId) => {
    await activateUser(userId);
    fetchUsers();
  };

  const handleDeactivate = async (userId) => {
    await deactivateUser(userId);
    fetchUsers();
  };

  const handleDelete = async (userId) => {
    await deleteUser(userId);
    fetchUsers();
  };

  const handleLogout = () => {
    logoutAdmin();
    navigate("/admin-login");
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <button onClick={handleLogout}>Logout</button>
      <h3>Users</h3>
      <table border="1">
        <thead>
          <tr>
            <th>Email</th>
            <th>Name</th>
            <th>Address</th>
            <th>Contact</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.email}</td>
              <td>{user.name}</td>
              <td>{user.address}</td>
              <td>{user.contact_number}</td>
              <td>{user.status}</td>
              <td>
                {user.status === "deactivate" ? (
                  <>
                    <button onClick={() => handleActivate(user.id)}>Activate</button>
                    <button onClick={() => handleDelete(user.id)}>Delete</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleDeactivate(user.id)}>Deactivate</button>
                    <button onClick={() => handleDelete(user.id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
