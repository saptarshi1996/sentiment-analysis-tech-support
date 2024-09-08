import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Button,
  Box
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <AppBar position="static" color="primary" sx={{ mb: 4, boxShadow: 'none' }}>
      <Container maxWidth="lg">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              fontWeight: 'bold', 
              color: 'white', 
              cursor: 'pointer',
            }} 
            onClick={() => handleNavigation('/')}
          >
            Sentiment Analysis Dashboard
          </Typography>
          <Box>
            <Button
              color="inherit"
              onClick={() => handleNavigation('/')}
              sx={{ 
                mr: 2, 
                fontWeight: 'bold', 
                textTransform: 'none', 
                ':hover': { 
                  backgroundColor: 'rgba(255, 255, 255, 0.2)' 
                } 
              }}
            >
              Exports
            </Button>
            <Button
              color="inherit"
              onClick={() => handleNavigation('/record')}
              sx={{ 
                mr: 2, 
                fontWeight: 'bold', 
                textTransform: 'none', 
                ':hover': { 
                  backgroundColor: 'rgba(255, 255, 255, 0.2)' 
                } 
              }}
            >
              Records
            </Button>
            <Button
              color="inherit"
              onClick={() => handleNavigation('/visualize')}
              sx={{ 
                fontWeight: 'bold', 
                textTransform: 'none', 
                ':hover': { 
                  backgroundColor: 'rgba(255, 255, 255, 0.2)' 
                } 
              }}
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
