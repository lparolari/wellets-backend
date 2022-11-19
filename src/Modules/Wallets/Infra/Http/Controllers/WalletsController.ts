import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';

import ShowWalletService from 'Modules/Wallets/Services/ShowWalletService';
import UpdateWalletService from 'Modules/Wallets/Services/UpdateWalletService';
import CreateWalletService from '../../../Services/CreateWalletService';
import IndexWalletsService from '../../../Services/IndexWalletsService';
import DeleteWalletService from '../../../Services/DeleteWalletService';

class WalletsController {
  public async create(
    request: Request,
    response: Response,
    _: NextFunction,
  ): Promise<Response> {
    const { alias, currency_id } = request.body;

    const { id } = request.user;

    const createWallet = container.resolve(CreateWalletService);

    const wallet = await createWallet.execute({
      user_id: id,
      alias,
      currency_id,
    });

    return response.status(201).json(wallet);
  }

  public async index(
    request: Request,
    response: Response,
    _: NextFunction,
  ): Promise<Response> {
    const { id } = request.user;
    const { portfolio_id, limit, page } = request.query;

    const indexWallets = container.resolve(IndexWalletsService);

    const wallets = await indexWallets.execute({
      user_id: id,
      limit: limit && Number(limit),
      page: page && Number(page),
      portfolio_id: portfolio_id && String(portfolio_id),
    });

    return response.json(wallets);
  }

  public async update(
    request: Request,
    response: Response,
    _: NextFunction,
  ): Promise<Response> {
    const { id } = request.user;
    const { wallet_id } = request.params;
    const { alias, balance } = request.body;

    const updateWallet = container.resolve(UpdateWalletService);

    const wallet = await updateWallet.execute({
      user_id: id,
      wallet_id,
      alias,
      balance,
    });

    return response.json(wallet);
  }

  public async delete(
    request: Request,
    response: Response,
    _: NextFunction,
  ): Promise<Response> {
    const { user } = request;

    const { wallet_id } = request.params;

    const deleteWallet = container.resolve(DeleteWalletService);

    const wallet = await deleteWallet.execute({
      user_id: user.id,
      wallet_id,
    });

    return response.status(200).json(wallet);
  }

  public async show(
    request: Request,
    response: Response,
    _: NextFunction,
  ): Promise<Response> {
    const { id } = request.user;
    const { wallet_id } = request.params;

    const showWallet = container.resolve(ShowWalletService);

    const wallets = await showWallet.execute({
      user_id: id,
      wallet_id,
    });

    return response.json(wallets);
  }
}

export default WalletsController;
