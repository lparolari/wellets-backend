import ICurrenciesRatesDTO from '../DTOs/ICurrenciesRatesDTO';
import ICurrencyHistoryDTO from '../DTOs/ICurrencyHistoryDTO';

interface IRatesProvider {
  getLatestRates(): Promise<ICurrenciesRatesDTO>;
  getHistory?(
    symbol: string,
    interval: string,
    startTime: Date,
    endTime: Date,
    limit: number,
  ): Promise<ICurrencyHistoryDTO>;
}

export default IRatesProvider;
