import axios, { AxiosInstance } from 'axios';

import RatesConfig from '../Config/RatesConfig';
import ICurrenciesRatesDTO from '../DTOs/ICurrenciesRatesDTO';
import IRatesProvider from '../Models/IRatesProvider';

interface SymbolPriceTicker {
  symbol: string;
  price: string;
}

class BinanceRatesProvider implements IRatesProvider {
  private api: AxiosInstance;

  private mappings: { [key: string]: string };

  constructor(api: AxiosInstance = undefined) {
    const { url } = RatesConfig.binance;

    // workaround for testing, we should always inject the api instance
    // however we have to figure out how to do it with tsyringe
    if (api) this.api = api;
    else
      this.api = axios.create({
        baseURL: url,
      });

    this.mappings = {
      BTCUSDT: 'BTC',
      ETHUSDT: 'ETH',
      BNBUSDT: 'BNB',
      EURUSDT: 'EUR',
      GBPUSDT: 'GBP',
      ATOMUSDT: 'ATOM',
    };
  }

  public async getLatestRates(): Promise<ICurrenciesRatesDTO> {
    const response = await this.api.get<SymbolPriceTicker[]>(
      '/api/v3/ticker/price',
    );

    const out = {} as ICurrenciesRatesDTO;

    response.data.forEach(item => {
      const { symbol, price } = item;

      const currency = this.mappings[symbol];
      const rate = 1 / parseFloat(price);

      if (currency) {
        out[currency] = rate;
      }
    });

    return out;
  }
}

export default BinanceRatesProvider;
