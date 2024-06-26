import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import AuthController from 'Shared/Containers/AuthProvider/Controllers/AuthController';
import PortfoliosController from '../Controllers/PortfoliosController';

const portfoliosRoutes = Router();
const portfoliosController = new PortfoliosController();
const authController = new AuthController();

portfoliosRoutes.use(authController.on);

portfoliosRoutes.get('/all', portfoliosController.indexAll);

// TODO: deprecated
portfoliosRoutes.get(
  '/:portfolio_id?/balance',
  celebrate({
    [Segments.PARAMS]: {
      portfolio_id: Joi.string().uuid(),
    },
  }),
  portfoliosController.balance,
);

portfoliosRoutes.get(
  '/balance',
  celebrate({
    [Segments.QUERY]: {
      portfolio_id: Joi.string().uuid(),
    },
  }),
  portfoliosController.balance,
);

portfoliosRoutes.get(
  '/:portfolio_id/rebalance',
  celebrate({
    [Segments.PARAMS]: {
      portfolio_id: Joi.string().uuid().required(),
    },
  }),
  portfoliosController.rebalance,
);

portfoliosRoutes.get(
  '/:portfolio_id/details',
  celebrate({
    [Segments.PARAMS]: {
      portfolio_id: Joi.string().uuid().required(),
    },
  }),
  portfoliosController.details,
);
portfoliosRoutes.get(
  '/:portfolio_id?/parents',
  celebrate({
    [Segments.PARAMS]: {
      portfolio_id: Joi.string().uuid(),
    },
  }),
  portfoliosController.parents,
);
portfoliosRoutes.get(
  '/:parent_id?',
  celebrate({
    [Segments.PARAMS]: {
      parent_id: Joi.string().uuid(),
    },
  }),
  portfoliosController.index,
);
portfoliosRoutes.get(
  '/details/:portfolio_id',
  celebrate({
    [Segments.PARAMS]: {
      portfolio_id: Joi.string().uuid().required(),
    },
  }),
  portfoliosController.details,
);
portfoliosRoutes.delete(
  '/:portfolio_id',
  celebrate({
    [Segments.PARAMS]: {
      portfolio_id: Joi.string().uuid().required(),
    },
  }),
  portfoliosController.delete,
);
portfoliosRoutes.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      alias: Joi.string().required(),
      weight: Joi.number().required().min(0).max(1),
      wallet_ids: Joi.array().items(Joi.string().uuid()),
      parent_id: Joi.string().uuid().allow(null),
    },
  }),
  portfoliosController.create,
);
portfoliosRoutes.put(
  '/:portfolio_id',
  celebrate({
    [Segments.PARAMS]: {
      portfolio_id: Joi.string().uuid().required(),
    },
    [Segments.BODY]: {
      alias: Joi.string().required(),
      weight: Joi.number().required().min(0).max(1),
      wallet_ids: Joi.array().items(Joi.string().uuid()),
      parent_id: Joi.string().uuid().allow(null),
    },
  }),
  portfoliosController.update,
);

export default portfoliosRoutes;
