import { inject, injectable } from 'tsyringe';

import AppError from 'Shared/Errors/AppError';

import IPortfoliosRepository from '../Repositories/IPortfoliosRepository';

interface IRequest {
  portfolio_id: string;
  user_id: string;
}

@injectable()
class DeletePortfolioService {
  constructor(
    @inject('PortfoliosRepository')
    private portfoliosRepository: IPortfoliosRepository,
  ) {}

  public async execute({ portfolio_id, user_id }: IRequest): Promise<void> {
    const portfolio = await this.portfoliosRepository.findById(portfolio_id);

    if (!portfolio) {
      throw new AppError('This portfolio does not exist!', 404);
    }

    if (portfolio.user_id !== user_id) {
      throw new AppError('You are not the owner of this portfolio!', 403);
    }

    await this.portfoliosRepository.delete(portfolio_id);
  }
}

export default DeletePortfolioService;
