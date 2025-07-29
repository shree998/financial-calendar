import React from 'react';
import { isToday, isSameMonth, isWithinInterval, isSameDay } from 'date-fns';
import { Tooltip, Box, useTheme } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const CalendarCell = ({ day, data, currentMonth, onClick, selectedRange, isFocused }) => {
  const theme = useTheme();
  const isCurrentMonth = isSameMonth(day, currentMonth);
  const isCurrentDay = isToday(day);
  const { start, end } = selectedRange;
  const isInRange = start && end && isWithinInterval(day, { start: new Date(start.openTime), end: new Date(end.openTime) });
  const isStart = start && isSameDay(day, new Date(start.openTime));
  const isEnd = end && isSameDay(day, new Date(end.openTime));

  const getVolatilitySx = (volatility) => {
    if (volatility < 1.5) return { backgroundColor: theme.palette.volatility.low };
    if (volatility < 3) return { backgroundColor: theme.palette.volatility.medium };
    return { backgroundColor: theme.palette.volatility.high };
  };


  const isPositive = data?.priceChangePercent >= 0;
  const tooltipContent = data ? (
    <Box>
      <div>Date: {day.toLocaleDateString()}</div>
      <div>Open: {data.open.toFixed(2)}</div>
      <div>Close: {data.close.toFixed(2)}</div>
      <div>Volume: {data.volume.toLocaleString()}</div>
      <div>Volatility: {data.volatility.toFixed(2)}%</div>
      <div>Perf: {data.priceChangePercent.toFixed(2)}%</div>
    </Box>
  ) : 'No data';

  return (
    <Tooltip title={tooltipContent} placement="top" arrow>
      <Box
        onClick={() => data && onClick(data)}
        sx={{
          position: 'relative',
          minHeight: 120,
          backgroundColor: 'background.paper',
          padding: 1,
          cursor: 'pointer',
          transition: 'transform 0.2s, box-shadow 0.2s',
          ...(data && getVolatilitySx(data.volatility)),
          ...(!isCurrentMonth && {
            backgroundColor: 'action.hover',
            color: 'text.disabled',
          }),
          ...(isFocused && { outline: `2px solid ${theme.palette.primary.dark}`, zIndex: 15 }),
          ...(isInRange && {
            backgroundColor: (theme) => `${theme.palette.primary.light}80`,
            borderRadius: 0,
          }),
          ...(isStart && { borderRadius: '50% 0 0 50%' }),
          ...(isEnd && { borderRadius: '0 50% 50% 0' }),
          ...(isStart && isEnd && { borderRadius: '50%' }),
          '&:hover': {
            transform: 'scale(1.03)',
            boxShadow: 6,
            zIndex: 10,
          },
        }}
      >
        <Box
          sx={{
            fontSize: '0.9em',
            fontWeight: 500,
            ...(isCurrentDay && {
              backgroundColor: 'primary.main',
              color: 'primary.contrastText',
              borderRadius: '50%',
              width: 24,
              height: 24,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }),
          }}
        >
          {day.getDate()}
        </Box>

        {data && isCurrentMonth && (
          <Box sx={{ mt: 1, fontSize: '0.8em' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                fontWeight: 'bold',
                color: isPositive ? 'success.main' : 'error.main',
              }}
            >
              {isPositive ? <ArrowUpwardIcon fontSize="inherit" /> : <ArrowDownwardIcon fontSize="inherit" />}
              {data.priceChangePercent.toFixed(1)}%
            </Box>
            <Box sx={{ position: 'absolute', bottom: 5, left: 5, right: 5, height: 5, backgroundColor: 'action.disabledBackground', borderRadius: '3px' }}>
              <Box sx={{ height: '100%', backgroundColor: 'primary.light', borderRadius: '3px', width: `${Math.min(100, (data.volume / 50000) * 100)}%` }} />
            </Box>
          </Box>
        )}
      </Box>
    </Tooltip>
  );
};

export default CalendarCell;