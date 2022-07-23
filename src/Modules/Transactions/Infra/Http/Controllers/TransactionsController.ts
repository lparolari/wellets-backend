import { Request, Response, NextFunction } from 'express';
import RevertTransactionService from 'Modules/Transactions/Services/RevertTransactionService';
import { container } from 'tsyringe';

import CreateTransactionService from '../../../Services/CreateTransactionService';
import UpdateTransactionService from '../../../Services/UpdateTransactionService';
import IndexTransactionsService from '../../../Services/IndexTransactionsService';

class TransactionsController {
  public async create(
    request: Request,
    response: Response,
    _: NextFunction,
  ): Promise<Response> {
    const { user } = request;
    const {
      description,
      value,
      wallet_id,
      dollar_rate,
      created_at,
      accumulation_id,
    } = request.body;

    const createTransaction = container.resolve(CreateTransactionService);

    const transaction = await createTransaction.execute({
      user_id: user.id,
      description,
      value,
      wallet_id,
      dollar_rate,
      created_at: created_at ? new Date(created_at) : undefined,
      accumulation_id,
    });

    return response.status(201).json(transaction);
  }

  public async update(
    request: Request,
    response: Response,
    _: NextFunction,
  ): Promise<Response> {
    const { user } = request;
    const { transaction_id } = request.params;
    const { description, value, dollar_rate, created_at } = request.body;

    const updateTransaction = container.resolve(UpdateTransactionService);

    const transaction = await updateTransaction.execute({
      transaction_id,
      user_id: user.id,
      description,
      value,
      dollar_rate,
      created_at: created_at ? new Date(created_at) : undefined,
    });

    return response.status(200).json(transaction);
  }

  public async index(
    request: Request,
    response: Response,
    _: NextFunction,
  ): Promise<Response> {
    const { user } = request;
    const { wallet_id, limit, page } = request.query;

    const indexTransactions = container.resolve(IndexTransactionsService);

    const transactions = await indexTransactions.execute({
      user_id: user.id,
      wallet_id: wallet_id.toString(),
      limit: Number(limit),
      page: Number(page),
    });

    return response.json(transactions);
  }

  public async revert(
    request: Request,
    response: Response,
    _: NextFunction,
  ): Promise<Response> {
    const { user } = request;
    const { transaction_id } = request.params;

    const revertTransaction = container.resolve(RevertTransactionService);

    const transactions = await revertTransaction.execute({
      user_id: user.id,
      transaction_id,
    });

    return response.json(transactions);
  }
}

export default TransactionsController;
