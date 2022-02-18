import { Router } from 'express';
// import { celebrate, Segments, Joi } from 'celebrate';

import AuthController from 'Shared/Containers/AuthProvider/Controllers/AuthController';
import WalletBalancesController from '../Controllers/WalletBalancesController';

const walletsRoutes = Router();
const authController = new AuthController();
const walletBalancesController = new WalletBalancesController();

walletsRoutes.use(authController.on);
walletsRoutes.get(
  '/history',
  // celebrate({
  //   [Segments.QUERY]: {
  //     portfolio_id: Joi.string().uuid(),
  //     limit: Joi.number().positive().max(25).required(),
  //     page: Joi.number().positive().required(),
  //   },
  // }),
  walletBalancesController.history,
);

export default walletsRoutes;
