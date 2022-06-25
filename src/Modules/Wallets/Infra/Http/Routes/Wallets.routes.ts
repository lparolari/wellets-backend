import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import AuthController from 'Shared/Containers/AuthProvider/Controllers/AuthController';
import WalletsController from '../Controllers/WalletsController';
import WalletsBalancesController from '../Controllers/WalletsBalancesController';
import WalletsTotalBalanceController from '../Controllers/WalletsTotalBalanceController';
import WalletsStatisticsController from '../Controllers/WalletsStatisticsController';

const walletsRoutes = Router();
const authController = new AuthController();
const walletsController = new WalletsController();
const walletsBalancesController = new WalletsBalancesController();
const walletsTotalBalanceController = new WalletsTotalBalanceController();
const walletsStatisticsController = new WalletsStatisticsController();

walletsRoutes.use(authController.on);

// list wallets
walletsRoutes.get(
  '/',
  celebrate({
    [Segments.QUERY]: {
      portfolio_id: Joi.string().uuid().allow(null),
      limit: Joi.number().positive().allow(null),
      page: Joi.number().positive().allow(null),
    },
  }),
  walletsController.index,
);

// create wallet
walletsRoutes.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      alias: Joi.string().required(),
      balance: Joi.number().min(0).allow(null),
      currency_id: Joi.string().uuid().required(),
    },
  }),
  walletsController.create,
);

// delete wallet
walletsRoutes.delete(
  '/:wallet_id',
  celebrate({
    [Segments.PARAMS]: {
      wallet_id: Joi.string().uuid().required(),
    },
  }),
  walletsController.delete,
);

// show wallet average load price
walletsRoutes.get(
  '/average-load-price',
  celebrate({
    [Segments.QUERY]: {
      wallet_id: Joi.string().uuid().required(),
      currency_id: Joi.string().uuid(),
    },
  }),
  walletsStatisticsController.exposure,
);

// show wallet balance
walletsRoutes.get(
  '/balance',
  celebrate({
    [Segments.QUERY]: {
      wallet_id: Joi.string().uuid().required(),
    },
  }),
  walletsBalancesController.show,
);

// show total wallets balance
walletsRoutes.get('/total-balance', walletsTotalBalanceController.show);

// show wallet
walletsRoutes.get(
  '/:wallet_id',
  celebrate({
    [Segments.PARAMS]: {
      wallet_id: Joi.string().uuid().required(),
    },
  }),
  walletsController.show,
);

export default walletsRoutes;
