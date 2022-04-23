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
