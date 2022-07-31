import { Router } from 'express';

import AuthController from 'Shared/Containers/AuthProvider/Controllers/AuthController';
import AssetsController from '../Controllers/AssetsController';

const assetsRoutes = Router();
const authController = new AuthController();
const assetsController = new AssetsController();

assetsRoutes.use(authController.on);
assetsRoutes.get('/', assetsController.index);

export default assetsRoutes;
