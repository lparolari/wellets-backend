import { Router } from 'express';

import AuthController from 'Shared/Containers/AuthProvider/Controllers/AuthController';
import TransactionsController from '../Controllers/TransactionsController';
import {
  createTransactionCelebration,
  listTransactionsCelebration,
  revertTransactionCelebration,
  updateTransactionCelebration,
} from './celebration';

const transactionsRouter = Router();
const authController = new AuthController();
const transactionsController = new TransactionsController();

transactionsRouter.use(authController.on);

transactionsRouter.post(
  '/',
  createTransactionCelebration,
  transactionsController.create,
);

transactionsRouter.put(
  '/:transaction_id',
  updateTransactionCelebration,
  transactionsController.update,
);

transactionsRouter.post(
  '/:transaction_id/revert',
  revertTransactionCelebration,
  transactionsController.revert,
);

transactionsRouter.get(
  '/',
  listTransactionsCelebration,
  transactionsController.index,
);

export default transactionsRouter;
