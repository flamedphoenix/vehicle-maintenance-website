import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from '../config';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Button,
} from "@mui/material";

const AdminDashboard = ({handleLogout}) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token"); // your JWT
        const response = await axios.get(`${API_URL}/admin/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to remove this user?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Remove user from state
      setUsers((prev) => prev.filter((user) => user.id !== userId));
    } catch (err) {
      console.error(err);
      alert("Failed to delete user.");
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Admin?</TableCell>
                <TableCell>Last Login</TableCell>
                <TableCell>IP Address</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {users.map((user) => (
                <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.is_admin ? "Yes" : "No"}</TableCell>
                <TableCell>{user.last_login ? new Date(user.last_login).toLocaleString() : "Never"}</TableCell>
                <TableCell>{user.last_ip || "Unknown"}</TableCell>
                    <Button
                    color="error"
                    varian="containded"
                    onClick={() => handleDelete(user.id)}
                    >
                        Remove
                    </Button>
                </TableRow>
            ))}
            </TableBody>
        </Table>
      </TableContainer>
        <Button onClick={handleLogout} variant="contained" color="primary">
                      Logout
        </Button>
    </Box>
  );
};

export default AdminDashboard;
