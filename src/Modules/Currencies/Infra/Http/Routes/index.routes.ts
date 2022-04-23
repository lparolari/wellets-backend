import { Router } from 'express';

import currenciesRoutes from './Currencies.routes';
import currencyRatesRoutes from './CurrencyRates.routes';

const routes = Router();

routes.use('/rate', currencyRatesRoutes);
routes.use('/', currenciesRoutes);

export default routes;
