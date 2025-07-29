import axios from 'axios';

const API_BASE_URL = 'https://api.binance.com/api/v3';

/**
 * Fetches historical Kline (candlestick) data from Binance.
 * @param {string} symbol - e.g., 'BTCUSDT'
 * @param {string} interval - e.g., '1d', '1h', '4h'
 * @param {number} limit - Number of data points to retrieve (max 1000)
 * @returns {Promise<Array>} - A promise that resolves to an array of Kline data.
 */
export const fetchKlineData = async (symbol = 'BTCUSDT', interval = '1d', limit = 100) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/klines`, {
      params: {
        symbol,
        interval,
        limit,
      },
    });
    return response.data.map(kline => ({
      openTime: kline[0],
      open: parseFloat(kline[1]),
      high: parseFloat(kline[2]),
      low: parseFloat(kline[3]),
      close: parseFloat(kline[4]),
      volume: parseFloat(kline[5]),
      closeTime: kline[6],
    }));
  } catch (error) {
    console.error('Error fetching Kline data:', error);
    return [];
  }
};