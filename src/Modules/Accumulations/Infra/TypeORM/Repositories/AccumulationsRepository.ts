import { EntityRepository, Repository, getRepository } from 'typeorm';

import Accumulation from '../Entities/Accumulation';
import IAccumulationsRepository from '../../../Repositories/IAccumulationsRepository';

@EntityRepository(Accumulation)
class AccumulationsRepository implements IAccumulationsRepository {
  private ormRepository: Repository<Accumulation>;

  constructor() {
    this.ormRepository = getRepository(Accumulation);
  }

  // public async find(): Promise<Accumulation[]> {
  //   return this.ormRepository.find();
  // }

  public async findByPortfolioId(portfolioId: string): Promise<Accumulation[]> {
    return this.ormRepository.find({
      where: { portfolio_id: portfolioId },
    });
  }
}

export default AccumulationsRepository;
