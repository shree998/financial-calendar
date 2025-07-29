import { format } from 'date-fns';
import { Box, Paper, Tooltip, Typography, useTheme } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const PeriodCell = ({ periodData, onClick }) => {
  const theme = useTheme();
  const getVolatilitySx = (volatility) => {
    if (volatility < 1.5) return { backgroundColor: theme.palette.volatility.low };
    if (volatility < 3) return { backgroundColor: theme.palette.volatility.medium };
    return { backgroundColor: theme.palette.volatility.high };
  };

  if (!periodData) return null;

  const {
    startDate,
    endDate,
    volume,
    volatility,
    priceChangePercent,
    periodType,
  } = periodData;

  const isPositive = priceChangePercent >= 0;
  const perfColor = isPositive ? 'success.main' : 'error.main';

  const title = periodType === 'Weekly'
    ? `Week of ${format(startDate, 'MMM d')}`
    : format(startDate, 'MMMM yyyy');

  const dateRange = `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d')}`;

  const tooltipContent = (
    <Box>
      <Typography variant="subtitle2">{title}</Typography>
      <Typography variant="body2">Total Volume: {volume.toLocaleString()}</Typography>
      <Typography variant="body2">Avg. Volatility: {volatility.toFixed(2)}%</Typography>
      <Typography variant="body2">Performance: {priceChangePercent.toFixed(2)}%</Typography>
    </Box>
  );

  return (
    <Tooltip title={tooltipContent} placement="top" arrow>
      <Paper
        elevation={5}
        onClick={() => onClick(periodData)}
        sx={{
          m: 1,
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          cursor: 'pointer',
          ...getVolatilitySx(periodData.volatility),
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'scale(1.03)',
            boxShadow: 6,
          },
        }}
      >
        <Box>
          <Typography variant="h6">{title}</Typography>
          <Typography variant="caption" color="text.secondary">{dateRange}</Typography>
        </Box>
        <Box sx={{ mt: 2, textAlign: 'right' }}>
          <Typography variant="h5" color={perfColor} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            {isPositive ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
            {priceChangePercent.toFixed(1)}%
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Volume: {(volume / 1_000_000).toFixed(2)}M
          </Typography>
        </Box>
      </Paper>
    </Tooltip>
  );
};

export default PeriodCell;