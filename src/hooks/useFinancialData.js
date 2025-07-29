import { useState, useEffect, useCallback } from 'react';
import { fetchKlineData } from '../services/binanceApi';
import { processDataIntoMap } from '../utils/dataProcessor';

/**
 * Custom hook to fetch and manage financial data.
 * @param {string} symbol - The financial instrument symbol (e.g., 'BTCUSDT').
 * @returns {{dataMap: Map, isLoading: boolean, error: string | null}}
 */
const useFinancialData = (symbol) => {
  const [dataMap, setDataMap] = useState(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async (instrumentSymbol) => {
    if (!instrumentSymbol) return;

    setIsLoading(true);
    setError(null);
    try {
      const rawData = await fetchKlineData(instrumentSymbol, '1d', 365);
      if (rawData && rawData.length > 0) {
        const processedData = processDataIntoMap(rawData);
        setDataMap(processedData);
      } else {
        setDataMap(new Map()); 
        throw new Error(`No data returned for symbol: ${instrumentSymbol}. It may be an invalid pair.`);
      }
    } catch (err) {
      console.error('Failed to load financial data:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []); 

  useEffect(() => {
    loadData(symbol);
  }, [symbol, loadData]); 

  return { dataMap, isLoading, error };
};

export default useFinancialData;