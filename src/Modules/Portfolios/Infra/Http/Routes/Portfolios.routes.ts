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

export default portfoliosRoutes;
