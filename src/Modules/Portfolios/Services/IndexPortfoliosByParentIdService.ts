import AppError from 'Shared/Errors/AppError';
import { injectable, inject } from 'tsyringe';
import Portfolio from '../Infra/TypeORM/Entities/Portfolio';

import IPortfoliosRepository from '../Repositories/IPortfoliosRepository';

interface IRequest {
  parent_id: string;
  user_id: string;
}

@injectable()
class IndexPortfoliosByParentIdService {
  constructor(
    @inject('PortfoliosRepository')
    private portfoliosRepository: IPortfoliosRepository,
  ) {}

  public async execute({ parent_id, user_id }: IRequest): Promise<Portfolio[]> {
    const parentPortfolio = await this.portfoliosRepository.findById(parent_id);

    if (parentPortfolio && parentPortfolio.user_id !== user_id) {
      throw new AppError('Parent portfolio not found!', 404);
    }

    const portfolios = await this.portfoliosRepository.find(user_id, parent_id);

    return portfolios;
  }
}

export default IndexPortfoliosByParentIdService;
