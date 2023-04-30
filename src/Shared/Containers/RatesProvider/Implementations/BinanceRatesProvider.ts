import axios, { AxiosInstance } from 'axios';

import RatesConfig from '../Config/RatesConfig';
import ICurrenciesRatesDTO from '../DTOs/ICurrenciesRatesDTO';
import IRatesProvider from '../Models/IRatesProvider';
import ICurrencyHistoryDTO from '../DTOs/ICurrencyHistoryDTO';

interface SymbolPriceTicker {
  symbol: string;
  price: string;
}

type Kline = [
  number, // Open time
  string, // Open
  string, // High
  string, // Low
  string, // Close
  string, // Volume
];

class BinanceRatesProvider implements IRatesProvider {
  private api: AxiosInstance;

  private mapping: { [key: string]: string };

  private mapping_rev: { [key: string]: string };

  constructor(api: AxiosInstance = undefined) {
    const { url } = RatesConfig.binance;

    // workaround for testing, we should always inject the api instance
    // however we have to figure out how to do it with tsyringe
    if (api) this.api = api;
    else
      this.api = axios.create({
        baseURL: url,
      });

    this.mapping = {
      BTCUSDT: 'BTC',
      ETHUSDT: 'ETH',
      BNBUSDT: 'BNB',
      EURUSDT: 'EUR',
      GBPUSDT: 'GBP',
      ATOMUSDT: 'ATOM',
    };

    this.mapping_rev = Object.entries(this.mapping).reduce(
      (acc, [key, value]) => {
        acc[value] = key;
        return acc;
      },
      {},
    );
  }

  public async getLatestRates(): Promise<ICurrenciesRatesDTO> {
    const response = await this.api.get<SymbolPriceTicker[]>(
      '/api/v3/ticker/price',
    );

    const out = {} as ICurrenciesRatesDTO;

    response.data.forEach(item => {
      const { symbol, price } = item;

      const currency = this.mapping[symbol];
      const rate = 1 / parseFloat(price);

      if (currency) {
        out[currency] = rate;
      }
    });

    return out;
  }

  public async getHistory(
    symbol: string,
    interval: string,
    startTime: Date,
    endTime: Date,
    limit = 1000,
  ): Promise<ICurrencyHistoryDTO> {
    const symbolQs = `symbol=${this.mapping_rev[symbol]}`;

    const qs = `?${symbolQs}&interval=${interval}&startTime=${startTime.getTime()}&endTime=${endTime.getTime()}&limit=${limit}`;
    const response = await this.api.get<Kline[]>(`/api/v3/klines${qs}`);

    return response.data.map(item => ({
      open_time: new Date(item[0]),
      open_price: parseFloat(item[1]),
      high_price: parseFloat(item[2]),
      low_price: parseFloat(item[3]),
      close_price: parseFloat(item[4]),
      volume: parseFloat(item[5]),
    }));
  }
}

export default BinanceRatesProvider;
