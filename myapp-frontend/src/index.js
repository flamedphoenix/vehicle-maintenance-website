import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Create MUI theme
const theme = createTheme({
  typography: {
    fontFamily: 'sans-serif',
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

<ThemeProvider theme={theme}>
    <CssBaseline /> {/* Optional: resets browser CSS to match MUI */}
        <BrowserRouter>
            <App />
        </BrowserRouter>
</ThemeProvider>
);
