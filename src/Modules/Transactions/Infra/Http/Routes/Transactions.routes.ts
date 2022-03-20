import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';

import AuthController from 'Shared/Containers/AuthProvider/Controllers/AuthController';
import TransactionsController from '../Controllers/TransactionsController';

const transactionsRouter = Router();
const authController = new AuthController();
const transactionsController = new TransactionsController();

transactionsRouter.use(authController.on);
transactionsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      wallet_id: Joi.string().uuid().required(),
      value: Joi.number().required(),
      dollar_rate: Joi.number(),
      description: Joi.string().required(),
    },
  }),
  transactionsController.create,
);
transactionsRouter.post(
  '/:transaction_id/revert',
  celebrate({
    [Segments.PARAMS]: {
      transaction_id: Joi.string().uuid().required(),
    },
  }),
  transactionsController.revert,
);
transactionsRouter.get(
  '/',
  celebrate({
    [Segments.QUERY]: {
      wallet_id: Joi.string().uuid().required(),
      limit: Joi.number().positive().max(25).required(),
      page: Joi.number().positive().required(),
    },
  }),
  transactionsController.index,
);

export default transactionsRouter;
