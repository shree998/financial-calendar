import { format } from 'date-fns';
import { Box, IconButton, Typography, ToggleButtonGroup, ToggleButton } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const CalendarHeader = ({
  currentMonth,
  onPrevMonth,
  onNextMonth,
  view,
  onViewChange
}) => {
  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      onViewChange(newView);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 16px',
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`

      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton onClick={onPrevMonth} aria-label="previous month">
          <ArrowBackIosNewIcon />
        </IconButton>
        <Typography variant="h5" component="h2" sx={{ mx: 2 }}>
          {format(currentMonth, 'MMMM yyyy')}
        </Typography>
        <IconButton onClick={onNextMonth} aria-label="next month">
          <ArrowForwardIosIcon />
        </IconButton>
      </Box>

      <ToggleButtonGroup
        value={view}
        exclusive
        onChange={handleViewChange}
        aria-label="time period"
      >
        <ToggleButton value="daily" aria-label="daily view">Day</ToggleButton>
        <ToggleButton value="weekly" aria-label="weekly view" >Week</ToggleButton>
        <ToggleButton value="monthly" aria-label="monthly view">Month</ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};

export default CalendarHeader;