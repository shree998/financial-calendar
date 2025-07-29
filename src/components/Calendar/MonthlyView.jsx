import { format } from 'date-fns';
import { Box, Paper, Typography, Grid, useTheme } from '@mui/material';
import {
  LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid, Brush, Legend, Bar
} from 'recharts';

const formatCompactNumber = (number) => {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(number);
};

const MonthlyView = ({ monthlyData, onMonthClick }) => {
  const theme = useTheme();

  const getVolatilitySx = (volatility) => {
    if (volatility < 1.5) return { backgroundColor: theme.palette.volatility.low };
    if (volatility < 3) return { backgroundColor: theme.palette.volatility.medium };
    return { backgroundColor: theme.palette.volatility.high };
  };

  if (!monthlyData) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography>Not enough data to display a monthly summary.</Typography>
      </Box>
    );
  }

  const {
    volatility, volume, priceChangePercent, low, high, dailyData,
  } = monthlyData;

  const isPositive = priceChangePercent >= 0;

  return (
    <Paper
      elevation={2}
      onClick={() => onMonthClick(monthlyData)}
      sx={{
        m: 2,
        p: 3,
        borderRadius: 4,
        cursor: 'pointer',
        border: `1px solid ${theme.palette.divider}`,
        transition: 'all 0.3s ease',
        ...getVolatilitySx(volatility),
        '&:hover': {
          transform: 'translateY(-1px)',
          boxShadow: 6,
          borderColor: theme.palette.primary.main
        },
      }}
    >
      <Typography variant="h5" component="h3" fontWeight="bold" mb={3}>
        {format(monthlyData.startDate, 'MMMM yyyy')} Summary
      </Typography>

      <Grid container spacing={2} mb={4} textAlign="center">
        <Grid item xs={6} sm={3}>
          <Typography variant="caption" color="text.secondary">Avg. Volatility</Typography>
          <Typography variant="h6" fontWeight="600">{volatility.toFixed(2)}%</Typography>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Typography variant="caption" color="text.secondary">Total Volume</Typography>
          <Typography variant="h6" fontWeight="600">{formatCompactNumber(volume)}</Typography>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Typography variant="caption" color="text.secondary">Performance</Typography>
          <Typography variant="h6" fontWeight="600" color={isPositive ? 'success.main' : 'error.main'}>
            {priceChangePercent.toFixed(2)}%
          </Typography>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Typography variant="caption" color="text.secondary">Price Range</Typography>
          <Typography variant="h6" fontWeight="600">{Math.round(low)}-{Math.round(high)}</Typography>
        </Grid>
      </Grid>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={dailyData} margin={{ top: 5, right: 20, left: 20, bottom: 20 }}>
          <CartesianGrid stroke={theme.palette.divider} strokeDasharray="3 3" />
          <XAxis
            dataKey="openTime"
            tickFormatter={(ts) => format(new Date(ts), 'd')}
            fontSize={12}
            tickLine={false}
            axisLine={false}
            stroke={theme.palette.text.secondary}
          />
          <YAxis
            fontSize={12}
            tickLine={false}
            axisLine={false}
            domain={['dataMin - (dataMax - dataMin) * 0.1', 'dataMax + (dataMax - dataMin) * 0.1']}
            stroke={theme.palette.text.secondary}
            width={80}
            tickFormatter={(tick) => tick.toLocaleString()}
          />
          <RechartsTooltip
            cursor={{ stroke: theme.palette.text.secondary, strokeWidth: 1, strokeDasharray: '3 3' }}
            contentStyle={{
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: '5px'
            }}
            labelStyle={{ color: theme.palette.text.primary }}
            labelFormatter={(label) => format(new Date(label), 'MMM d, yyyy')}
          />
          <Line type="monotone" dataKey="close" strokeWidth={2} dot={false} stroke={theme.palette.primary.main} />
        </LineChart>
      </ResponsiveContainer>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: -2 }}>
        ↔ Close Price
      </Typography>
    </Paper>
  );
};

export default MonthlyView;