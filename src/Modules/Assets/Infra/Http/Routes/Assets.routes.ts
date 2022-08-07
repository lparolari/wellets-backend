import { Router } from 'express';

import AuthController from 'Shared/Containers/AuthProvider/Controllers/AuthController';
import AssetsController from '../Controllers/AssetsController';
import { averageLoadPriceCelebration, balanceCelebration } from './celebration';

const assetsRoutes = Router();
const authController = new AuthController();
const assetsController = new AssetsController();

assetsRoutes.use(authController.on);
assetsRoutes.get('/', assetsController.index);
assetsRoutes.get('/allocations', assetsController.allocation);
assetsRoutes.get('/balance', balanceCelebration, assetsController.balance);
assetsRoutes.get('/total-balance', assetsController.totalBalance);
assetsRoutes.get(
  '/average-load-price',
  averageLoadPriceCelebration,
  assetsController.averageLoadPrice,
);

export default assetsRoutes;
