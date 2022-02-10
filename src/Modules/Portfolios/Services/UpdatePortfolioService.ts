import { inject, injectable } from 'tsyringe';

import AppError from 'Shared/Errors/AppError';
import IWalletsRepository from 'Modules/Wallets/Repositories/IWalletsRepository';

import Portfolio from '../Infra/TypeORM/Entities/Portfolio';
import IUpdatePortfolioDTO from '../DTOs/IUpdatePortfolioDTO';
import IPortfoliosRepository from '../Repositories/IPortfoliosRepository';

@injectable()
class UpdatePortfolioService {
  constructor(
    @inject('PortfoliosRepository')
    private portfoliosRepository: IPortfoliosRepository,

    @inject('WalletsRepository')
    private walletsRepository: IWalletsRepository,
  ) {}

  public async execute(data: IUpdatePortfolioDTO): Promise<Portfolio> {
    const { id, weight, alias, user_id, wallet_ids, parent_id } = data;

    const portfolio = await this.portfoliosRepository.findById(id);

    if (!portfolio) {
      throw new AppError('This portfolio does not exists!', 404);
    }

    if (portfolio.user_id !== user_id) {
      throw new AppError(
        'You does not have permission to manage this portfolio!',
        403,
      );
    }

    if (alias !== portfolio.alias) {
      const aliasInUse = await this.portfoliosRepository.findByUserIdAndAlias(
        user_id,
        alias,
      );

      if (aliasInUse) {
        throw new AppError('This alias is already in use!');
      }
    }

    if (id === parent_id) {
      throw new AppError('This portfolio and its parent must be different!');
    }

    const wallets = await Promise.all(
      wallet_ids.map(wallet_id => this.walletsRepository.findById(wallet_id)),
    );

    if (
      wallets.map(x => x.user_id === user_id).filter(x => x).length !==
      wallet_ids.length
    ) {
      throw new AppError('One or more wallets not found!');
    }

    const parentPortfolio = await this.portfoliosRepository.findById(parent_id);

    if (!!parentPortfolio && parentPortfolio.user_id !== user_id) {
      throw new AppError('You cannot access this portfolio!', 403);
    }

    const newPortfolio = {
      id,
      weight,
      alias,
      user_id,
      wallet_ids,
      parent_id,
      wallets,
      parent: parentPortfolio,
    };

    return this.portfoliosRepository.update(id, newPortfolio);
  }
}

export default UpdatePortfolioService;
