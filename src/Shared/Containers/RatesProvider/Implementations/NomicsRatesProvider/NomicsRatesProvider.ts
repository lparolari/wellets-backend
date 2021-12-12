import axios, { AxiosInstance } from 'axios';

import RatesConfig from '../../Config/RatesConfig';
import ICurrenciesRatesDTO from '../../DTOs/ICurrenciesRatesDTO';
import IRatesProvider from '../../Models/IRatesProvider';
import INomicsCurrency from './INomicsCurrency';
import convertToCurrenciesRates from './NomicsRatesAdapter';

class NomicsRatesProvider implements IRatesProvider {
  private api: AxiosInstance;

  constructor() {
    const { url, id } = RatesConfig.nomics;

    this.api = axios.create({
      baseURL: url,
      params: {
        key: id,
      },
    });
  }

  public async getLatestRates(): Promise<ICurrenciesRatesDTO> {
    const response = await this.api.get<INomicsCurrency[]>(
      '/currencies/ticker?ids=CRO,BNB',
    );

    return convertToCurrenciesRates(response.data);
  }
}

export default NomicsRatesProvider;
