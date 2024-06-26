import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import AuthController from 'Shared/Containers/AuthProvider/Controllers/AuthController';
import WalletsController from '../Controllers/WalletsController';
import WalletsBalancesController from '../Controllers/WalletsBalancesController';
import WalletsTotalBalanceController from '../Controllers/WalletsTotalBalanceController';

const walletsRoutes = Router();
const authController = new AuthController();
const walletsController = new WalletsController();
const walletsBalancesController = new WalletsBalancesController();
const walletsTotalBalanceController = new WalletsTotalBalanceController();

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
      description: Joi.string().allow(null),
      currency_id: Joi.string().uuid().required(),
    },
  }),
  walletsController.create,
);

// update wallet
walletsRoutes.patch(
  '/:wallet_id',
  celebrate({
    [Segments.PARAMS]: {
      wallet_id: Joi.string().uuid().required(),
    },
    [Segments.BODY]: {
      alias: Joi.string().required(),
      description: Joi.string().allow(null),
      balance: Joi.number().required(),
    },
  }),
  walletsController.update,
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
