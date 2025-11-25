import axios from 'axios';
import { Box, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import React from 'react';
import { API_URL } from '../config';

export function CarItem({ car, onDelete }) {
  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${car.name}"?`)) return;

    try {
      await axios.delete(`${API_URL}/cars/${car.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      onDelete(car.id);  // Tell parent to remove it from state
    } catch (err) {
      alert("Failed to delete car.");
      console.error(err);
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <span>{car.name}</span>
      <IconButton size="small" onClick={handleDelete}>
       <DeleteIcon fontSize="small" />
      </IconButton>
    </Box>
  );
}

