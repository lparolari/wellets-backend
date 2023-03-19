import axios, { AxiosInstance } from 'axios';

import RatesConfig from '../Config/RatesConfig';
import ICurrenciesRatesDTO from '../DTOs/ICurrenciesRatesDTO';
import IRatesProvider from '../Models/IRatesProvider';

class OpenExchaneRatesProvider implements IRatesProvider {
  private api: AxiosInstance;

  constructor() {
    const { url, id } = RatesConfig.openexchange;

    this.api = axios.create({
      baseURL: url,
      headers: {
        authorization: `Token ${id}`,
      },
    });
  }

  public async getLatestRates(): Promise<ICurrenciesRatesDTO> {
    const response = await this.api.get('/latest.json?show_alternative=true');

    return response.data.rates as ICurrenciesRatesDTO;
  }
}

export default OpenExchaneRatesProvider;
