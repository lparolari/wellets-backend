import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';

import AuthController from 'Shared/Containers/AuthProvider/Controllers/AuthController';
import CurrenciesController from '../Controllers/CurrenciesController';

const currenciesRoutes = Router();
const authController = new AuthController();
const currenciesController = new CurrenciesController();

currenciesRoutes.use(authController.on);
currenciesRoutes.get(
  '/',
  celebrate({
    [Segments.QUERY]: {
      sort_by: Joi.string(),
    },
  }),
  currenciesController.index,
);
currenciesRoutes.get(
  '/:id/klines',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
    [Segments.QUERY]: {
      interval: Joi.string().required().valid('1h', '1d', '1w', '1m', '1y'),
      start_time: Joi.date().required(),
      end_time: Joi.date().required(),
    },
  }),
  currenciesController.klines,
);
currenciesRoutes.put(
  '/:id',
  celebrate({
    [Segments.BODY]: {
      favorite: Joi.boolean().required(),
    },
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  currenciesController.update,
);

export default currenciesRoutes;
