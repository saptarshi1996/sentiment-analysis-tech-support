import { AppBar, Toolbar, Typography, Container, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Navbar = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  // Function to handle button clicks and navigation
  const handleNavigation = (path) => {
    navigate(`/${path}`);
  };

  return (
    <AppBar position="static" color="primary" sx={{ mb: 4 }}>
      <Container maxWidth="lg">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Sentiment Analysis Dashboard
          </Typography>
          <Box>
            <Button
              color="inherit"
              onClick={() => handleNavigation('')}
              sx={{ mr: 2 }}
            >
              Exports
            </Button>
            <Button
              color="inherit"
              onClick={() => handleNavigation('record')}
              sx={{ mr: 2 }}
            >
              Records
            </Button>
            <Button
              color="inherit"
              onClick={() => handleNavigation('visualize')}
            >
              Visualize
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;