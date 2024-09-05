import { inject, injectable } from 'tsyringe';

import AppError from 'Shared/Errors/AppError';
import IWalletsRepository from 'Modules/Wallets/Repositories/IWalletsRepository';

import Portfolio from '../Infra/TypeORM/Entities/Portfolio';
import ICreatePortfolioDTO from '../DTOs/ICreatePortfolioDTO';
import IPortfoliosRepository from '../Repositories/IPortfoliosRepository';

@injectable()
class CreateWalletService {
  constructor(
    @inject('PortfoliosRepository')
    private portfoliosRepository: IPortfoliosRepository,

    @inject('WalletsRepository')
    private walletsRepository: IWalletsRepository,
  ) {}

  public async execute({
    alias,
    weight,
    user_id,
    wallet_ids,
    parent_id,
  }: ICreatePortfolioDTO): Promise<Portfolio> {
    const exists = await this.portfoliosRepository.findByUserIdAndAlias(
      user_id,
      alias,
    );

    if (exists) {
      throw new AppError('You already have a portfolio with this alias!');
    }

    const wallets = await Promise.all(
      wallet_ids.map(wallet_id => this.walletsRepository.findById(wallet_id)),
    );

    if (
      wallets.filter(x => x).map(x => x.user_id === user_id).length !==
      wallet_ids.length
    ) {
      throw new AppError('One or more wallets not found!');
    }

    const parent = await this.portfoliosRepository.findById(parent_id);

    if (!!parent && parent.user_id !== user_id) {
      throw new AppError('You cannot access this portfolio!', 403);
    }

    const portfolio = await this.portfoliosRepository.create({
      alias,
      weight,
      user_id,
      parent,
      wallets,
    });

    return portfolio;
  }
}

export default CreateWalletService;
