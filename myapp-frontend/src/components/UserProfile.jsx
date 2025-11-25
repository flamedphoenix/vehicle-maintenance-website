import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link as RouterLink, Navigate } from "react-router-dom";

import { Box, Tabs, Tab, Typography, Button, Paper, Drawer, Link, TextField } from "@mui/material";

import { API_URL } from '../config';
import { CarItem } from './CarItem';  // Adjust path as needed
import { ChangePassword } from './ChangePassword';


function UserProfile({user, handleLogout}) {
  const [cars, setCars] = useState([]);
  const [logs, setLogs] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newCarName, setNewCarName] = useState("");
  const token = localStorage.getItem("token");

  const email = "dean@qihl.com";
  const subject = "";
  const body = "Hello,\n\nI would like to get more information about...";


  const toggleSidebar = (open) => () => {
    setSidebarOpen(open);
  };

 useEffect(() => {
    fetchCars();
  }, []);

  useEffect(() => {
    if (selectedCar) {
      fetchLogs(selectedCar.id);
    }
  }, [selectedCar]);

  const fetchCars = async () => {
    try {
      const res = await axios.get(`${API_URL}/cars/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCars(res.data);
      if (res.data.length > 0) {
        setSelectedCar(res.data[0]);
      }
    } catch (error) {
      console.error("Failed to fetch cars:", error);
      if (error.response?.status === 401) {
        handleLogout();
      }
    }
  };  // <-- THIS CLOSING BRACE WAS MISSING

const handleAddCar = async () => {
  try {
    const res = await axios.post(`${API_URL}/cars/`, { name: newCarName }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setCars((prev) => [...prev, res.data]);
    setSelectedCar(res.data);
    setNewCarName("");
  } catch (error) {
    console.error("Error adding car:", error);
  }
};

const fetchLogs = async (carId) => {
  try {
    const res = await axios.get(`${API_URL}/logs/?car_id=${carId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setLogs(res.data);
  } catch (error) {
    console.error("Failed to fetch logs:", error);
    if (error.response?.status === 401) {
      handleLogout();
    }
  }
};

const handleDeleteLog = async (deletedId, carId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete(`${API_URL}/logs/${deletedId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { car_id: carId }
    });

    if (response.status === 200) {
      setLogs(prevLogs => prevLogs.filter(log => log.id !== deletedId));
    }
  } catch (error) {
    if (error.response) {
      console.error("Server responded with:", error.response.status, error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error setting up request:", error.message);
    }
    alert("Failed to delete log. Please try again.");
  }
};



console.log("User in Profile:", user);


  if (!user) return <Navigate to="/" replace />;

  return (


    <Box sx={{ 
              width: "100vw",          // Use viewport width
              height: "100vh",  
              //padding: 2.5, 
             // position: "relative",
              //display: "flex",
              //justifyContent: "center",
              //alignItems: "center",
              
              }}>
      {/* Settings button */}
      <Box sx={{ position: "absolute", top: 0, left: 0 }}>
        <Button variant="outlined" size="small" onClick={toggleSidebar(true)}>
          Settings
        </Button>
      </Box>

      {/* Main dashboard content */}
      <Box
        sx={{
          bgcolor: "#f8f9fa",
          borderRadius: 2,
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          color: "#333",
          padding: 3,
          width: "98.5vw", 
          //margin: "10px auto", 
          marginLeft: "10px",
        }}
      >
        <Typography variant="h4" component="h2" sx={{ mb: 1, color: "#007BFF", fontWeight: "bold" }}>
          Welcome to your Vehicle Maintenance Dashboard, {user.username}!
        </Typography>

        <Tabs
          value={selectedCar?.id || false}
          onChange={(e, newCarId) => {
            const selected = cars.find((c) => c.id === newCarId);
            setSelectedCar(selected);
          }}
          sx={{ mb: 2 }}
        >
          {cars.map((car) => (
            <Tab
              key={car.id}
              value={car.id}
              label={
                <CarItem
                  car={car}
                  onDelete={(deletedId) => {
                    setCars((prev) => prev.filter((c) => c.id !== deletedId));
                    if (selectedCar?.id === deletedId) {
                      setSelectedCar(null); // deselect if current tab deleted
                    }
                  }}
                />
              }
              sx={{ minHeight: "auto", padding: 0 }} // optional: make tabs tighter
            />
          ))}
        </Tabs>
        
        <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
          <TextField
            size="small"
            label="New Car"
            value={newCarName}
            onChange={(e) => setNewCarName(e.target.value)}
          />
          <Button variant="outlined" onClick={handleAddCar}>Add</Button>
        </Box>

        <Box sx={{ borderTop: "1px solid #ddd", pt: 2 }}>
          {logs.length === 0 ? (
            <Typography>No maintenance logs yet.</Typography>
          ) : (
            logs.map((log) => (
              <Paper
                key={log.id}
                elevation={1}
                sx={{
                  p: 2,
                  mb: 1.5,
                  bgcolor: "#fff",
                  borderRadius: 1,
                  boxShadow: "0 2px 4px rgba(190, 55, 55, 0.05)",
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 0.5 }}>
                  {log.title}
                </Typography>
                <Typography>Date Done: {new Date(log.date).toLocaleDateString()}</Typography>
                {log.next_due && (
                <Typography variant="caption" sx={{ color: "#555" }}>
                  Next Due: {new Date(log.next_due).toLocaleDateString()}
                </Typography>
                )}
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {log.description}
                </Typography>

                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  sx={{ mt: 1 }}
                  onClick={() => handleDeleteLog(log.id, log.car_id)}
                >
                  Delete
                </Button>

              </Paper>
            ))
          )}
        </Box>

        <Link
          component={RouterLink}
          to="/AddLog"
          underline="none"
          sx={{ mt: 3, display: "inline-block" }}
        >
          <Button variant="contained" color="primary">
            Add Log
          </Button>
        </Link>
      </Box>
      

      {/* Sidebar Drawer */}
      <Drawer anchor="left" open={sidebarOpen} onClose={toggleSidebar(false)}>
        <Box
          sx={{
            width: 250,
            height: "100%", // make the Box fill the Drawer vertically
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between", // push content to top and bottom
            padding: 2,
          }}
          role="presentation"
          onKeyDown={toggleSidebar(false)}
        >
          {/* Top content */}
          <Box>
            <Typography variant="h6" gutterBottom>
              {user.username}
            </Typography>
            {/* Add other links or settings here */}

          {/* Render the ChangePassword button + modal component */}
          <ChangePassword username={user.username} />

            <Button
              variant="contained"
              color="primary"
              href={`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`}
            >
              Contact Us
            </Button>
          </Box>

          {/* Bottom content */}
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={handleLogout} variant="contained" color="primary">
              Logout
            </Button>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
}

export default UserProfile;

  
