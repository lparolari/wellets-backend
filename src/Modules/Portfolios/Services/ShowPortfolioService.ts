import AppError from 'Shared/Errors/AppError';
import { injectable, inject } from 'tsyringe';
import Portfolio from '../Infra/TypeORM/Entities/Portfolio';

import IPortfoliosRepository from '../Repositories/IPortfoliosRepository';

interface IRequest {
  id: string;
  user_id: string;
}

@injectable()
class ShowPortfolioService {
  constructor(
    @inject('PortfoliosRepository')
    private portfoliosRepository: IPortfoliosRepository,
  ) {}

  public async execute({
    id,
    user_id,
  }: IRequest): Promise<Portfolio | undefined> {
    const portfolio = await this.portfoliosRepository.findById(id);

    if (!portfolio) {
      throw new AppError('Portfolio not found!', 404);
    }

    if (portfolio.user_id !== user_id) {
      throw new AppError('You cannot access this portfolio!', 403);
    }

    return portfolio;
  }
}

export default ShowPortfolioService;
