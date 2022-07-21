import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';

import AuthController from 'Shared/Containers/AuthProvider/Controllers/AuthController';
import AccumulationsController from '../Controllers/AccumulationsController';

const routes = Router();
const authController = new AuthController();
const accumulationsController = new AccumulationsController();

routes.use(authController.on);

routes.get(
  '/:accumulation_id/next-entry',
  celebrate({
    [Segments.PARAMS]: {
      accumulation_id: Joi.string().uuid().required(),
    },
  }),
  accumulationsController.nextEntry,
);

routes.get(
  '/',
  celebrate({
    [Segments.QUERY]: {
      wallet_id: Joi.string().uuid().required(),
    },
  }),
  accumulationsController.indexByWallet,
);

export default routes;
