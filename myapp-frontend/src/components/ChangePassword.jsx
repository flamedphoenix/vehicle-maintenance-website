import React, { useState } from "react";
import { Box, Button, TextField, Typography, Modal } from "@mui/material";
import axios from "axios";
import { API_URL } from "../config";

export function ChangePassword({ username }) {
  const [open, setOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setOldPassword("");
    setNewPassword("");
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      await axios.post(`${API_URL}/users/change-password`, {
        username,
        old_password: oldPassword,
        new_password: newPassword,
      });
      setSuccess("Password changed successfully!");
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to change password");
    }
  };

  return (
    <Box>
      <Button variant="contained" color="secondary" onClick={handleOpen}>
        Change Password
      </Button>

      <Modal 
        open={open} 
        onClose={handleClose}
        aria-labelledby="change-password-title"
        aria-describedby="change-password-description"
        >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            p: 4,
            borderRadius: 2,
            boxShadow: 24,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Change Password
          </Typography>

          <TextField
            label="Old Password"
            type="password"
            required
            margin="normal"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />

          <TextField
            label="New Password"
            type="password"
            required
            margin="normal"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          {error && (
            <Typography color="error" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
          {success && (
            <Typography color="success.main" sx={{ mt: 1 }}>
              {success}
            </Typography>
          )}

          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            Save
          </Button>
          <Button onClick={handleClose} sx={{ mt: 1 }}>
            Cancel
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}

export default ChangePassword;
