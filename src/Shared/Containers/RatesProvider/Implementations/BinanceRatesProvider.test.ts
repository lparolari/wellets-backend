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
});
