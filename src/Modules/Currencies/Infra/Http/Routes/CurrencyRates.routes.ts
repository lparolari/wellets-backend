import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';

import AuthController from 'Shared/Containers/AuthProvider/Controllers/AuthController';

import CurrencyRatesController from '../Controllers/CurrencyRatesController';

const currencyRatesRoutes = Router();
const authController = new AuthController();
const currencyRatesController = new CurrencyRatesController();

// Private routes
currencyRatesRoutes.use(authController.on);
currencyRatesRoutes.get(
  '/',
  celebrate({
    [Segments.QUERY]: {
      base_currency: Joi.string().required(),
      target_currency: Joi.string().required(),
    },
  }),
  currencyRatesController.show,
);
currencyRatesRoutes.post('/sync', currencyRatesController.sync);

export default currencyRatesRoutes;
