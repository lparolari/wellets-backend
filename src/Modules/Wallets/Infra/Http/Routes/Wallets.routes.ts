import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import AuthController from 'Shared/Containers/AuthProvider/Controllers/AuthController';
import WalletsController from '../Controllers/WalletsController';
import WalletBalancesController from '../Controllers/WalletBalancesController';
import WalletsTotalBalanceController from '../Controllers/WalletsTotalBalanceController';
import WalletStatisticsController from '../Controllers/WalletStatisticsController';

const walletsRoutes = Router();
const authController = new AuthController();
const walletsController = new WalletsController();
const walletBalancesController = new WalletBalancesController();
const walletsTotalBalanceController = new WalletsTotalBalanceController();
const walletStatisticsController = new WalletStatisticsController();

walletsRoutes.use(authController.on);
walletsRoutes.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      alias: Joi.string().required(),
      currency_id: Joi.string().uuid().required(),
      balance: Joi.number().min(0),
    },
  }),
  walletsController.create,
);
walletsRoutes.get(
  '/',
  celebrate({
    [Segments.QUERY]: {
      portfolio_id: Joi.string().uuid(),
      limit: Joi.number().positive().max(25),
      page: Joi.number().positive(),
    },
  }),
  walletsController.index,
);
walletsRoutes.delete(
  '/:wallet_id',
  celebrate({
    [Segments.PARAMS]: {
      wallet_id: Joi.string().uuid().required(),
    },
  }),
  walletsController.delete,
);
walletsRoutes.get('/total-balance', walletsTotalBalanceController.show);
walletsRoutes.get(
  '/balance',
  celebrate({
    [Segments.QUERY]: {
      wallet_id: Joi.string().uuid().required(),
    },
  }),
  walletBalancesController.show,
);
walletsRoutes.get(
  '/:wallet_id',
  celebrate({
    [Segments.PARAMS]: {
      wallet_id: Joi.string().uuid().required(),
    },
  }),
  walletsController.show,
);
walletsRoutes.get(
  '/:wallet_id/average-load-price',
  celebrate({
    [Segments.PARAMS]: {
      wallet_id: Joi.string().uuid().required(),
    },
    [Segments.QUERY]: {
      currency_id: Joi.string().uuid(),
    },
  }),
  walletStatisticsController.exposure,
);

export default walletsRoutes;
