import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Button, 
  Box, 
  Container,
  useTheme
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Header({ darkMode }) {
  const navigate = useNavigate();
  const theme = useTheme();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Login', path: '/login' }
  ];

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{ 
        backgroundColor: darkMode 
          ? 'rgba(26, 32, 44, 0.95)'
          : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              onClick={() => navigate('/')}
              sx={{
                fontSize: '1.2rem',
                fontWeight: 'bold',
                color: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: 'transparent',
                  color: theme.palette.primary.dark,
                },
              }}
            >
              RecyclePay
            </Button>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {navItems.map((item) => (
              <Button
                key={item.name}
                onClick={() => navigate(item.path)}
                sx={{
                  color: darkMode ? '#fff' : theme.palette.text.primary,
                  '&:hover': {
                    backgroundColor: darkMode 
                      ? 'rgba(255, 255, 255, 0.1)'
                      : 'rgba(0, 0, 0, 0.04)',
                  },
                }}
              >
                {item.name}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header;