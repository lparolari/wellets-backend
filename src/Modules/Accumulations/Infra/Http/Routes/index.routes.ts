import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';

import AuthController from 'Shared/Containers/AuthProvider/Controllers/AuthController';
import AccumulationsController from '../Controllers/AccumulationsController';

const routes = Router();
const authController = new AuthController();
const accumulationsController = new AccumulationsController();

routes.use(authController.on);

routes.get(
  '/:portfolio_id',
  celebrate({
    [Segments.PARAMS]: {
      portfolio_id: Joi.string().uuid().required(),
    },
  }),
  accumulationsController.index,
);

export default routes;
