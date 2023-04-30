import BinanceRatesProvider from './BinanceRatesProvider';

describe('BinanceRatesProvider', () => {
  describe('getLatestRates', () => {
    it('should return rates', async () => {
      const api = {
        get: jest.fn().mockResolvedValue({
          data: [
            { symbol: 'BTCUSDT', price: '10000' },
            { symbol: 'ETHUSDT', price: '200' },
          ],
        }),
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ratesProvider = new BinanceRatesProvider(api as any);

      const rates = await ratesProvider.getLatestRates();

      expect(rates).toEqual({
        BTC: 0.0001,
        ETH: 0.005,
      });
    });
  });

  describe('getHistoricalData', () => {
    it('should return historical data', async () => {
      const api = {
        get: jest.fn().mockResolvedValue({
          data: [
            [
              1499040000000, // Kline open time
              '0.01634790', // Open price
              '0.80000000', // High price
              '0.01575800', // Low price
              '0.01577100', // Close price
              '148976.11427815', // Volume
              1499644799999, // Kline Close time
              '2434.19055334', // Quote asset volume
              308, // Number of trades
              '1756.87402397', // Taker buy base asset volume
              '28.46694368', // Taker buy quote asset volume
              '0', // Unused field, ignore.
            ],
          ],
        }),
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ratesProvider = new BinanceRatesProvider(api as any);

      const rates = await ratesProvider.getHistoricalData(
        'BTC',
        '1d',
        new Date(1499040000000),
        new Date(1499040000000),
      );

      expect(rates).toEqual([
        {
          open_time: new Date(1499040000000),
          open_price: 0.0163479,
          high_price: 0.8,
          low_price: 0.015758,
          close_price: 0.015771,
          volume: 148976.11427815,
        },
      ]);
    });
  });
});
