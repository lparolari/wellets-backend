import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import AuthController from 'Shared/Containers/AuthProvider/Controllers/AuthController';
import PortfoliosController from '../Controllers/PortfoliosController';

const portfoliosRoutes = Router();
const portfoliosController = new PortfoliosController();
const authController = new AuthController();

portfoliosRoutes.use(authController.on);
portfoliosRoutes.get('/', portfoliosController.index);
portfoliosRoutes.get(
  '/:parent_id',
  celebrate({
    [Segments.PARAMS]: {
      parent_id: Joi.string().uuid(),
    },
  }),
  portfoliosController.index,
);
portfoliosRoutes.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      alias: Joi.string().required(),
      weight: Joi.number().required().min(0).max(1),
      wallet_ids: Joi.array().items(Joi.string().uuid()),
      parent_id: Joi.string().uuid(),
    },
  }),
  portfoliosController.create,
);

export default portfoliosRoutes;
