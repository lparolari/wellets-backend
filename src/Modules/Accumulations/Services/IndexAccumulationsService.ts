import IPortfoliosRepository from 'Modules/Portfolios/Repositories/IPortfoliosRepository';
import AppError from 'Shared/Errors/AppError';
import { inject, injectable } from 'tsyringe';
import Accumulation from '../Infra/TypeORM/Entities/Accumulation';
import IAccumulationsRepository from '../Repositories/IAccumulationsRepository';

@injectable()
class IndexAccumulationsService {
  constructor(
    @inject('PortfoliosRepository')
    private portfoliosRepository: IPortfoliosRepository,

    @inject('AccumulationsRepository')
    private accumulationsRepository: IAccumulationsRepository,
  ) {}

  public async execute({
    user_id,
    portfolio_id,
  }: {
    user_id: string;
    portfolio_id: string;
  }): Promise<Accumulation[]> {
    const portfolio = await this.portfoliosRepository.findById(portfolio_id);

    if (!portfolio || portfolio.user_id !== user_id) {
      throw new AppError('Accumulation plan not found!', 404);
    }

    return this.accumulationsRepository.findByPortfolioId(portfolio_id);
  }
}

export default IndexAccumulationsService;
