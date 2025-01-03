import {
  Box,
  Typography
} from '@mui/material';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '16px',
        backgroundColor: '#f0f0f0',
        marginTop: 'auto',
        width: '100%',
      }}
    >
      <Typography variant="body2" color="textSecondary">
        Sentiment Analysis Dashboard © 2024
      </Typography>
    </Box>
  );
};
