export const calculateSMA = (data, period) => {
  return data.map((item, index, arr) => {
    if (index < period - 1) return { ...item, sma: null };
    const slice = arr.slice(index - period + 1, index + 1);
    const sum = slice.reduce((acc, val) => acc + val.close, 0);
    return { ...item, sma: sum / period };
  });
};

export const calculateRSI = (data, period = 14) => {
  let gains = 0;
  let losses = 0;
  const changes = data.map((item, i) => i > 0 ? item.close - data[i - 1].close : 0);


  for (let i = 1; i < period + 1; i++) {
    changes[i] > 0 ? gains += changes[i] : losses -= changes[i];
  }
  let avgGain = gains / period;
  let avgLoss = losses / period;

  const rsiValues = [{ ...data[period], rsi: 100 - (100 / (1 + avgGain / avgLoss)) }];

  for (let i = period + 1; i < data.length; i++) {
    const change = changes[i];
    const gain = change > 0 ? change : 0;
    const loss = change < 0 ? -change : 0;

    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;
    
    const rs = avgLoss === 0 ? Infinity : avgGain / avgLoss;
    const rsi = 100 - (100 / (1 + rs));
    rsiValues.push({ ...data[i], rsi });
  }
  

  return data.map(d => {
      const rsiData = rsiValues.find(r => r.openTime === d.openTime);
      return { ...d, rsi: rsiData ? rsiData.rsi : null };
  });
};