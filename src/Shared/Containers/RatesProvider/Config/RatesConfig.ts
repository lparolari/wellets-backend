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
} as IRatesConfig;
