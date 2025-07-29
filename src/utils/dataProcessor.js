import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth,   eachDayOfInterval,
  eachWeekOfInterval  } from 'date-fns';
  import { calculateSMA, calculateRSI } from './indicatorCalculations';

/**
 * Calculates metrics for a single day's kline data.
 * @param {object} dayData - The kline data for one day.
 * @returns {object} - Calculated metrics.
 */
export const calculateDayMetrics = (dayData) => {
  if (!dayData) return {};

  const priceChange = dayData.close - dayData.open;
  const priceChangePercent = ((priceChange / dayData.open) * 100);
  
  // Simple volatility: (High - Low) / Open
  const volatility = ((dayData.high - dayData.low) / dayData.open) * 100;

  return {
    ...dayData,
    priceChange,
    priceChangePercent,
    volatility,
  };
};

/**
 * Processes raw API data into a map keyed by date 'yyyy-MM-dd'.
 * @param {Array} klineData - Array of kline data from the API.
 * @returns {Map<string, object>} - A map of date strings to processed data.
 */
export const processDataIntoMap = (klineData) => {
  const dataMap = new Map();
  klineData.forEach(day => {
    const dateKey = format(new Date(day.openTime), 'yyyy-MM-dd');
    dataMap.set(dateKey, calculateDayMetrics(day));
  });
  return dataMap;
};

/**
 * Aggregates a set of daily data points into a single summary object.
 * @param {Array<object>} periodData - An array of daily data objects.
 * @returns {object | null} - An aggregated data object or null if no data.
 */
const aggregatePeriod = (periodData) => {
  if (!periodData || periodData.length === 0) {
    return null;
  }

  const validDays = periodData.filter(d => d);
  if (validDays.length === 0) return null;

  const firstDay = validDays[0];
  const lastDay = validDays[validDays.length - 1];

  const high = Math.max(...validDays.map(d => d.high));
  const low = Math.min(...validDays.map(d => d.low));
  const volume = validDays.reduce((sum, d) => sum + d.volume, 0);
  const volatilitySum = validDays.reduce((sum, d) => sum + d.volatility, 0);
  
  const open = firstDay.open;
  const close = lastDay.close;
  const openTime = firstDay.openTime; // Represents the start of the period

  const priceChange = close - open;
  const priceChangePercent = ((priceChange / open) * 100);
  const avgVolatility = volatilitySum / validDays.length;

  return {
    open, high, low, close, volume, openTime,
    priceChange, priceChangePercent,
    volatility: avgVolatility, 
  };
};

/**
 * Generates weekly summaries for a given month from a map of daily data.
 * @param {Map<string, object>} dataMap - The map of daily financial data.
 * @param {Date} currentMonth - The month to generate weekly summaries for.
 * @returns {Array<object>} - An array of weekly summary objects.
 */
export const aggregateIntoWeeks = (dataMap, currentMonth) => {
  const weeks = eachWeekOfInterval(
    { start: startOfMonth(currentMonth), end: endOfMonth(currentMonth) },
    { weekStartsOn: 1 } // Monday
  );

  return weeks.map(weekStart => {
    const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
    const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });
    
   const weekDailyData = daysInWeek
        .map(day => dataMap.get(format(day, 'yyyy-MM-dd')))
        .filter(Boolean)
        .sort((a,b) => a.openTime - b.openTime);
    const aggregatedData = aggregatePeriod(weekDailyData);

    if (!aggregatedData) return null;

    return {
      ...aggregatedData,
      dailyData: weekDailyData, 
      startDate: weekStart,
      endDate: weekEnd,
      periodType: 'Weekly'
    };
  }).filter(Boolean);
};


/**
 * Aggregates a month's data and includes the daily data for charting.
 * @param {Map<string, object>} dataMap - The map of daily financial data.
 * @param {Date} currentMonth - The month to generate the summary for.
 * @returns {object | null} - The monthly summary object, including an array of daily data points.
 */
export const aggregateIntoMonthWithDaily = (dataMap, currentMonth) => {
    const daysInMonth = eachDayOfInterval({ start: startOfMonth(currentMonth), end: endOfMonth(currentMonth) });
    
 
    const monthDailyData = daysInMonth
        .map(day => dataMap.get(format(day, 'yyyy-MM-dd')))
        .filter(Boolean)
        .sort((a, b) => a.openTime - b.openTime);

    if (monthDailyData.length === 0) return null;

    const aggregatedData = aggregatePeriod(monthDailyData);
    
    if (!aggregatedData) return null;

    return {
        ...aggregatedData,
          startDate: startOfMonth(currentMonth),
        endDate: endOfMonth(currentMonth),    
        dailyData: monthDailyData, 
        periodType: 'Monthly'
    };
};

export const aggregateDateRange = (dataMap, startTime, endTime) => {
  let dailyData = [];
  for (const [dateKey, dayData] of dataMap.entries()) {
    if (dayData.openTime >= startTime && dayData.openTime <= endTime) {
      dailyData.push(dayData);
    }
  }
  dailyData.sort((a, b) => a.openTime - b.openTime);

  if (dailyData.length === 0) return null;


  let dataWithSma = calculateSMA(dailyData, 20); 
  let dataWithRsi = calculateRSI(dataWithSma, 14); 
  
  const aggregate = aggregatePeriod(dailyData); 
  return {
    ...aggregate,
    dailyData: dataWithRsi,
    periodType: 'Range',
    startDate: new Date(startTime),
    endDate: new Date(endTime),
  };
};