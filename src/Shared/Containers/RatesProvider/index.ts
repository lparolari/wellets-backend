import { container } from 'tsyringe';

import RatesConfig from './Config/RatesConfig';
import IRatesProvider from './Models/IRatesProvider';
import OpenExchangeRatesProvider from './Implementations/OpenExchangeRatesProvider';
import NomicsRatesProvider from './Implementations/NomicsRatesProvider/NomicsRatesProvider';
import CoinlayerRatesProvider from './Implementations/CoinlayerRatesProvider/CoinlayerRatesProvider';

const drivers = {
  openexchange: OpenExchangeRatesProvider,
  nomics: NomicsRatesProvider,
  coinlayer: CoinlayerRatesProvider,
};

container.registerSingleton<IRatesProvider>(
  'RatesProvider',
  drivers[RatesConfig.driver],
);
