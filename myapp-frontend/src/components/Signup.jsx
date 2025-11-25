import React, { useState } from "react";
import axios from "axios";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";
import { API_URL } from '../config';

function Signup({ onSignup }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [capsLock, setCapsLock] = useState(false);

  const handleKeyDown = (e) => {
    if (e.getModifierState("CapsLock")) {
      setCapsLock(true);
    } else {
      setCapsLock(false);
    }
  };
  const handleKeyUp = (e) => {
    if (!e.getModifierState("CapsLock")) {
      setCapsLock(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      await axios.post(`${API_URL}/users/signup`, {
        username,
        password,
      });
      setSuccess("Signup successful! You can now log in.");
      setUsername("");
      setPassword("");
      onSignup();
    } catch (err) {
      setError(err.response?.data?.detail || "Signup failed");
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        maxWidth: 400,
        margin: "40px auto",
        padding: 4,
        bgcolor: "#f9f9f9",
        borderRadius: 2,
      }}
    >
      <Typography variant="h5" component="h1" sx={{ mb: 3, textAlign: "center" }}>
        Sign Up
      </Typography>
      <Box component="form" onSubmit={submit} noValidate>
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          required
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoFocus
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          required
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp} 
        />
         {capsLock && (
          <Typography color="error" variant="caption" sx={{ mt: 1, mb: 2 }}>
            Caps lock is on
          </Typography>
        )}

        {error && (
          <Typography color="error" sx={{ mt: 1, mb: 2 }}>
            {error}
          </Typography>
        )}
        {success && (
          <Typography color="success.main" sx={{ mt: 1, mb: 2 }}>
            {success}
          </Typography>
        )}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Sign Up
        </Button>
      </Box>
    </Paper>
  );
}

export default Signup;
