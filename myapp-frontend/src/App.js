import axios from 'axios';
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import { Container, Box, Typography, Button } from '@mui/material';
import Login from "./components/Login";
import Signup from "./components/Signup";
import UserProfile from "./components/UserProfile";
import AddLog from "./components/AddLog";
import { API_URL } from './config';
import AdminDashboard from "./components/AdminDashboard";
import AdminRoute from "./components/AdminRoute";

function App() {
  const [user, setUser] = useState(null);
  const [showSignup, setShowSignup] = useState(false);

  // Fetch current user with JWT token if available
  const fetchUser = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    setUser(null);
    return;
  }

  try {
    const res = await axios.get(`${API_URL}/users/me`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    console.log(res.data); // check that is_admin is true for admin
    setUser(res.data);  // axios puts the response body in res.data
    
  } catch (error) {
    console.error("Error fetching user:", error);
    setUser(null);
  }
};

  useEffect(() => {
    fetchUser();
  }, []);

  // Called after successful login to reload user info
  const handleLogin = () => {
    fetchUser();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (


    
      <Box sx={{ 
                minHeight: '100%', 
                minWidth: '100%',
                backgroundColor: '#f0f2f5', 
                py: 5,
                overflowX: "hidden", 
                overflowY: "hidden", 
                }}>
          <Routes>
            <Route
              path="/"
              element={
                user ? (
                  user.is_admin ? (
                    <Navigate to="/admin" replace />
                  ) : (
                    <Navigate to="/profile" replace />
                  )
                ) : showSignup ? (
                  <>
                    <Signup onSignup={() => setShowSignup(false)} />
                    <Typography mt={2} sx={{ textAlign: 'center' }}>
                      Already have an account?{" "}
                      <Button onClick={() => setShowSignup(false)} variant="text">Login</Button>
                    </Typography>
                  </>
                ) : (
                  <>
                    <Login onLogin={handleLogin} />
                    <Typography mt={2} sx={{ textAlign: 'center' }}>
                      Don't have an account?{" "}
                      <Button onClick={() => setShowSignup(true)} variant="text">Sign Up</Button>
                    </Typography>
                  </>
                )
              }
            />

            <Route
              path="/profile"
              element={
                user ? (
                  <>
                    <UserProfile user={user} handleLogout={handleLogout} />
                  </>
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />

            <Route
              path="/AddLog"
              element={
                user ? <AddLog user={user} /> : <Navigate to="/" replace />
              }
            />

            <Route
            path = "/admin"
            element={
              
              <AdminRoute user={user}>
                <AdminDashboard handleLogout={handleLogout} />
              </AdminRoute>
            }
            />

          </Routes>
        </Box>
  );
}
export default App;
