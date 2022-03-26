import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import AuthController from 'Shared/Containers/AuthProvider/Controllers/AuthController';
import WalletsController from '../Controllers/WalletsController';
import WalletBalancesController from '../Controllers/WalletBalancesController';
import WalletsTotalBalanceController from '../Controllers/WalletsTotalBalanceController';
import WalletExposureController from '../Controllers/WalletExposureController';

const walletsRoutes = Router();
const authController = new AuthController();
const walletsController = new WalletsController();
const walletBalancesController = new WalletBalancesController();
const walletsTotalBalanceController = new WalletsTotalBalanceController();
const walletExposureController = new WalletExposureController();

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
      limit: Joi.number().positive().max(25).required(),
      page: Joi.number().positive().required(),
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
walletsRoutes.get(
  '/total-balance',
  celebrate({
    [Segments.QUERY]: {
      base_currency_id: Joi.string().uuid().required(),
    },
  }),
  walletsTotalBalanceController.show,
);
walletsRoutes.get(
  '/balance',
  celebrate({
    [Segments.QUERY]: {
      wallet_id: Joi.string().uuid().required(),
      target_currency: Joi.string().required(),
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
  '/:wallet_id/exposure',
  celebrate({
    [Segments.PARAMS]: {
      wallet_id: Joi.string().uuid().required(),
      currency_id: Joi.string().uuid(),
    },
  }),
  walletExposureController.exposure,
);

export default walletsRoutes;
