import { createTheme } from '@mui/material/styles';

// --- Base Theme Settings ---
const baseThemeOptions = {
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
  components: {
    MuiToggleButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 'bold',
        },
      },
    },
  },
};

// --- Light Theme ---
export const lightTheme = createTheme({
  ...baseThemeOptions,
  palette: {
    mode: 'light',
    background: {
      default: '#f5f7fa', 
      paper: '#ffffff',
    },
    // Volatility Colors
    volatility: {
      low: 'rgba(76, 175, 80, 0.4)',  // Green
      medium: 'rgba(255, 193, 7, 0.5)', // Yellow
      high: 'rgba(244, 67, 54, 0.5)',   // Red
    },
    // Volatility Border Colors
    volatilityBorder: {
      low: '#4caf50',
      medium: '#ffc107',
      high: '#f44336',
    },
  },
});

// --- Dark Theme ---
export const darkTheme = createTheme({
  ...baseThemeOptions,
  palette: {
    mode: 'dark',
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    volatility: {
      low: 'rgba(102, 187, 106, 0.4)',
      medium: 'rgba(255, 213, 79, 0.4)',
      high: 'rgba(229, 115, 115, 0.4)',
    },
    volatilityBorder: {
      low: '#66bb6a',
      medium: '#ffd54f',
      high: '#e57373',
    },
  },
});

// --- Colorblind-Friendly Theme ---
export const colorblindFriendlyTheme = createTheme({
  ...baseThemeOptions,
  palette: {
    mode: 'light',
    background: {
      default: '#f5f7fa',
      paper: '#ffffff',
    },
    success: {
      main: '#005a9c', // A strong blue for positive
    },
    error: {
      main: '#d66c00', // A strong orange for negative
    },
    volatility: {
      low: 'rgba(0, 90, 156, 0.4)',    // Blue
      medium: 'rgba(191, 191, 191, 0.6)', // Gray
      high: 'rgba(214, 108, 0, 0.5)',  // Orange
    },
    volatilityBorder: {
      low: '#005a9c',
      medium: '#bfbfbf',
      high: '#d66c00',
    },
  },
});


// --- GoQuant Theme (Default) ---
export const goQuantTheme = createTheme({
  palette: {
    mode: 'dark', 
    primary: {
      main: '#02fb82', 
      contrastText: '#000000',
    },
    secondary: {
      main: '#b22222', 
      contrastText: '#ffffff',
    },
    success: {
      main: '#02fb82', 
    },
    error: {
      main: '#b22222',
    },
    background: {
      default: '#121212',
      paper: '#1a1a1a',  
    },
    text: {
      primary: '#ffffff',
      secondary: '#a0a0a0',
      disabled: '#555555',
    },
    divider: '#333333',
    volatility: {
      low: 'rgba(0, 255, 127, 0.15)',  
      medium: 'rgba(255, 165, 0, 0.15)', 
      high: 'rgba(178, 34, 34, 0.2)',  
    },
    volatilityBorder: {
      low: '#02fb82',
      medium: '#ffa500',
      high: '#b22222',
    },
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none', 
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: '4px',
        },
        containedPrimary: {
            background: 'linear-gradient(45deg, #00ff7f 30%, #00e673 90%)',
        }
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          color: '#a0a0a0',
          textTransform: 'none',
          '&.Mui-selected': {
            color: '#ffffff',
            backgroundColor: '#333333',
          },
        },
      },
    },
    MuiInputLabel: {
        styleOverrides: {
            root: {
                color: '#a0a0a0',
            }
        }
    },
    MuiOutlinedInput: {
        styleOverrides: {
            root: {
                '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#333333',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#a0a0a0',
                },
            }
        }
    }
  },
});