import React, { useState, useMemo } from 'react';
import { ChakraProvider, Box } from '@chakra-ui/react';
import { ThemeProvider as MUIThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import About from './pages/About';
import Contact from './pages/Contact';
import FAQPage from './pages/FAQPage';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import RecyclerDashboard from './pages/RecyclerDashboard';
import CompanyDashboard from './pages/CompanyDashboard';
import Header from './components/Header';
import Footer from './components/Footer';

import theme from './theme';
import muiTheme from './muiTheme';
import backgroundImage from './background.jpeg';

function App() {  const [darkMode, setDarkMode] = useState(false);
  const toggleDarkMode = () => setDarkMode(!darkMode);

  const muiThemeWithMode = useMemo(() => createTheme({
    ...muiTheme,
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#4CAF50',
      },
      secondary: {
        main: '#2E7D32',
      },
      background: {
        ...muiTheme.palette.background,
        default: darkMode ? '#1A202C' : '#f8faf8',
        paper: darkMode ? '#2D3748' : '#fff'
      },
      text: {
        primary: darkMode ? '#fff' : 'rgba(0, 0, 0, 0.87)',
        secondary: darkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)'
      }
    }
  }), [darkMode]);
  return (
    <ChakraProvider theme={theme}>
      <MUIThemeProvider theme={muiThemeWithMode}>
        <CssBaseline />
        <Router>
          <Box
            minH="100vh"
            display="flex"
            flexDirection="column"
            position="relative"
            sx={{
              '&::before': {
                content: '""',
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                opacity: darkMode ? 0.6 : 0.8,
                zIndex: -1
              }
            }}
          >
            <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
            <Box flex="1" position="relative" zIndex={1}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<RecyclerDashboard />} />
                <Route path="/company-dashboard" element={<CompanyDashboard />} />
              </Routes>
            </Box>
            <Footer darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          </Box>        </Router>
      </MUIThemeProvider>
    </ChakraProvider>
  );
}

export default App;