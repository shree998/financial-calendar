import React, { useState, useMemo, useEffect } from 'react';
import { Container, Typography, CssBaseline, Box, CircularProgress, Select, MenuItem, FormControl, InputLabel, Alert, Paper } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import Calendar from './components/Calendar/Calendar';
import DashboardPanel from './components/DashboardPanel/DashboardPanel';
import useFinancialData from './hooks/useFinancialData'; 
import { lightTheme, darkTheme, colorblindFriendlyTheme, goQuantTheme } from './styles/theme';
import { aggregateDateRange } from './utils/dataProcessor';

function App() {
  const [panelData, setPanelData] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [financialInstrument, setFinancialInstrument] = useState('BTCUSDT');
  const [themeMode, setThemeMode] = useState('goquant');
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const { dataMap, isLoading, error } = useFinancialData(financialInstrument);

const handleItemClick = (data) => {
 
    if (data.periodType === 'Weekly' || data.periodType === 'Monthly') {
      setDateRange({ start: null, end: null }); 
      setPanelData(data);
      setIsPanelOpen(true);
      return;
    }


    if (data.periodType === 'Daily') {
      const { start, end } = dateRange;

      // If user clicks the start day again (and end is not set), it's a request to view that single day.
      if (start && !end && data.openTime === start.openTime) {
        setDateRange({ start, end: data }); // Complete the range with the same day
        return; // The useEffect will handle opening the panel
      }

      // If starting a new selection or the range is already complete
      if (!start || end) {
        setDateRange({ start: data, end: null });
        setIsPanelOpen(false); // Close panel while selecting a new range
      } 
      // If completing a valid range
      else if (data.openTime > start.openTime) {
        setDateRange({ ...dateRange, end: data });
      } 
      // If an invalid end date is clicked (before start), start a new range
      else {
        setDateRange({ start: data, end: null });
      }
    }
  };



   const handlePanelClose = () => {
    setIsPanelOpen(false);
    setDateRange({ start: null, end: null }); 
  }
  const handleInstrumentChange = (event) => setFinancialInstrument(event.target.value);
  const handleThemeChange = (event) => setThemeMode(event.target.value);
const theme = useMemo(() => {
    switch (themeMode) {
      case 'dark':
        return darkTheme;
      case 'colorblind':
        return colorblindFriendlyTheme;
      case 'light': 
      return lightTheme;
      case 'goquant':
      default:
        return goQuantTheme;
    }
  }, [themeMode]);

  useEffect(() => {
    if (dateRange.start && dateRange.end) {
      const aggregated = aggregateDateRange(dataMap, dateRange.start.openTime, dateRange.end.openTime);
    setPanelData(aggregated)
      setIsPanelOpen(true);
    }
  }, [dateRange, dataMap]);

  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Financial Data Calendar
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel id="instrument-select-label">Instrument</InputLabel>
              <Select
                labelId="instrument-select-label"
                value={financialInstrument}
                label="Instrument"
                onChange={handleInstrumentChange}
              >
                <MenuItem value={'BTCUSDT'}>BTC/USDT</MenuItem>
                <MenuItem value={'ETHUSDT'}>ETH/USDT</MenuItem>
                <MenuItem value={'BNBUSDT'}>BNB/USDT</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel id="theme-select-label">Theme</InputLabel>
              <Select
                labelId="theme-select-label"
                value={themeMode}
                label="Theme"
                onChange={handleThemeChange}
              >
                <MenuItem value="goquant">GoQuant</MenuItem>
                <MenuItem value="light">Light</MenuItem>
                <MenuItem value="dark">Dark</MenuItem>
                <MenuItem value="colorblind">Colorblind Friendly</MenuItem>
              
              </Select>
            </FormControl>
          </Box>
        </Box>

        <Paper elevation={2} sx={{ position: 'relative', minHeight: '500px', borderRadius: '8px', overflow: 'hidden' }}>
           {isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 20, backgroundColor: 'rgba(255,255,255,0.7)' }}>
              <CircularProgress />
              <Typography sx={{ ml: 2 }}>Fetching {financialInstrument} data...</Typography>
            </Box>
          )}
          {error && !isLoading && (
             <Alert severity="error" sx={{m: 2}}>{error}</Alert>
          )}
          <Calendar dataMap={dataMap}   onItemClick={handleItemClick} selectedRange={dateRange}/>
        </Paper>

        <DashboardPanel 
          open={isPanelOpen} 
           onClose={handlePanelClose} 
        data={panelData} 
          financialInstrument={financialInstrument} 

        />
      </Container>
    </ThemeProvider>
  );
}

export default App;