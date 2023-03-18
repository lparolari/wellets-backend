import axios, { AxiosInstance } from 'axios';

import RatesConfig from '../../Config/RatesConfig';
import ICurrenciesRatesDTO from '../../DTOs/ICurrenciesRatesDTO';
import IRatesProvider from '../../Models/IRatesProvider';

type Response = {
  rates: { [acronym: string]: string };
};

class CoinlayerRatesProvider implements IRatesProvider {
  private api: AxiosInstance;

  private id: string;

  constructor() {
    const { url, id } = RatesConfig.coinlayer;

    this.id = id;

    this.api = axios.create({
      baseURL: url,
    });
  }

  public async getLatestRates(): Promise<ICurrenciesRatesDTO> {
    const response = await this.api.get<Response>(
      `/live?access_key=${this.id}`,
    );

    const rates: ICurrenciesRatesDTO = {};

    Object.keys(response.data.rates).forEach(ticker => {
      rates[ticker] = 1 / Number.parseFloat(response.data.rates[ticker]);
    });

    return rates;
  }
}

export default CoinlayerRatesProvider;
