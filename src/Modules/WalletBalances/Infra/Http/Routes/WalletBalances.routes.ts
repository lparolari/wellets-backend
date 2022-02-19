import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import AuthController from 'Shared/Containers/AuthProvider/Controllers/AuthController';
import WalletBalancesController from '../Controllers/WalletBalancesController';

const walletsRoutes = Router();
const authController = new AuthController();
const walletBalancesController = new WalletBalancesController();

walletsRoutes.use(authController.on);
walletsRoutes.get(
  '/history',
  celebrate({
    [Segments.QUERY]: {
      wallet_id: Joi.string().required().uuid(),
      interval: Joi.string().valid('1d').required(),
      start: Joi.date().required(),
      end: Joi.date().required(),
    },
  }),
  walletBalancesController.history,
);

export default walletsRoutes;
