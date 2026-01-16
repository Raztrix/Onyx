import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark', // This flips all text to white and backgrounds to dark
    primary: {
      main: '#ffffff', // High-contrast white for buttons/highlights
    },
    secondary: {
      main: '#cfcfcf', // Soft gray for secondary actions
    },
    background: {
      default: '#121212', // The "Onyx" black background
      paper: '#1e1e1e', // Slightly lighter for cards/modals
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0b0b0',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    // Customizing the Cards to look cleaner
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none', // Removes the default blue tint in MUI dark mode
          backgroundColor: '#1e1e1e',
          borderRadius: 12, // Softer corners
          boxShadow: '0 4px 20px 0 rgba(0,0,0,0.5)', // Deep shadow
        },
      },
    },
    // Customizing Buttons to be bold
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none', // Keeps text normal (not ALL CAPS)
          fontWeight: 600,
        },
      },
    },
    // Customizing Input fields to blend in
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#333', // Subtle border
            },
            '&:hover fieldset': {
              borderColor: '#fff', // White on hover
            },
          },
        },
      },
    },
  },
});

export default theme;
