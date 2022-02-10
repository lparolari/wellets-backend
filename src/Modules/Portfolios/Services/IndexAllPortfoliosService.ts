import { injectable, inject } from 'tsyringe';

import Portfolio from '../Infra/TypeORM/Entities/Portfolio';
import IPortfoliosRepository from '../Repositories/IPortfoliosRepository';

interface IRequest {
  user_id: string;
}

@injectable()
class IndexAllPortfoliosService {
  constructor(
    @inject('PortfoliosRepository')
    private portfoliosRepository: IPortfoliosRepository,
  ) {}

  public async execute({ user_id }: IRequest): Promise<Portfolio[]> {
    return this.portfoliosRepository.findByUserId(user_id);
  }
}

export default IndexAllPortfoliosService;
