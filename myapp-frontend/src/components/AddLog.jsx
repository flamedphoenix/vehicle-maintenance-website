import React, { useState } from "react";
import { useEffect } from "react";
import { Navigate, useNavigate} from "react-router-dom";
import axios from 'axios';
import { API_URL } from '../config';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

function AddLog({ user }) {
  if (!user) {
    return <Navigate to="/" />;
  }

  const navigate = useNavigate();

  const [log, setLog] = useState({
    title: "logs",
    description: "",
    date: "",
    next_due: "",
    car_id: ""
  });


  

  const [cars, setCars] = useState([]);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/cars/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCars(response.data);
      } catch (error) {
        console.error("Failed to fetch cars:", error);
      }
    };

  fetchCars();
}, []);

  const handleChange = (e) => {

    const { name, value } = e.target;
    setLog((prev) => ({ ...prev, [name]: name === "car_id" ? Number(value) : value, }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  console.log("Submitting log:", log);

  try {
    const token = localStorage.getItem("token");
    const payload = {
      title: log.title,
      description: log.description,
      date: log.date,
      next_due: log.next_due,  // Note snake_case here for backend
      car_id: log.car_id,
    };
    await axios.post(`${API_URL}/logs/`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    navigate("/profile");  // Go back to profile after success
  } catch (error) {
    console.error("Failed to add log:", error);
    // optionally show error message to user
  }





};
  return (
  <Container maxWidth="sm">
      <Paper elevation={3} sx={{ mt: 6, p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Add Maintenance Log
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            label="Title"
            name="title"
            value={log.title}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Description"
            name="description"
            value={log.description}
            onChange={handleChange}
            fullWidth
            margin="normal"
            multiline
            rows={4}
            required
          />

          <FormControl fullWidth margin="normal" required>
            <Select
              labelId="car-label"
              name="car_id"
              value={log.car_id}
              label="Select Car"
              onChange={handleChange}
              displayEmpty
            >
              <MenuItem value="">
                <em>Select a car</em>
              </MenuItem>
              {cars.map((car) => (
                <MenuItem key={car.id} value={car.id}>
                  {car.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Date Performed"
            name="date"
            type="date"
            value={log.date}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            label="Next Due"
            name="next_due"
            type="date"
            value={log.next_due}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
            <Button variant="contained" color="primary" type="submit">
              Save Log
            </Button>
            <Button variant="outlined" color="secondary" onClick={() => navigate("/profile")}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default AddLog;