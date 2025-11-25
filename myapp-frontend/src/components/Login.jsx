import React, { useState } from "react";
import axios from "axios";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";
import { API_URL } from '../config';

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
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
    try {
      const response = await axios.post(`${API_URL}/users/token`, new URLSearchParams({
        username,
        password,
      }), {
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
      });
      localStorage.setItem("token", response.data.access_token);
      setError(null);
      onLogin();
    } catch (err) {
      setError("Invalid username or password");
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
        Login
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
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Login
        </Button>
      </Box>
    </Paper>
  );
}

export default Login;
