interface IRatesConfig {
  driver: 'openexchange' | 'nomics';
  openexchange: {
    id: string;
    url: string;
  };
  nomics: {
    id: string;
    url: string;
  };
  coinlayer: {
    id: string;
    url: string;
  };
  binance: {
    url: string;
  };
}

export default {
  driver: process.env.RATES_DRIVER,
  openexchange: {
    id: process.env.RATES_OPENEXCHANGE_ID,
    url: 'https://openexchangerates.org/api',
  },
  nomics: {
    id: process.env.RATES_NOMICS_ID,
    url: 'https://api.nomics.com/v1',
  },
  coinlayer: {
    id: process.env.RATES_COINLAYER_ID,
    url: 'http://api.coinlayer.com/api',
  },
  binance: {
    url: 'https://api.binance.com',
  },
} as IRatesConfig;
