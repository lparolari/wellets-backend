import { EntityRepository, Repository, getRepository } from 'typeorm';

import Accumulation from '../Entities/Accumulation';
import IAccumulationsRepository from '../../../Repositories/IAccumulationsRepository';

@EntityRepository(Accumulation)
class AccumulationsRepository implements IAccumulationsRepository {
  private ormRepository: Repository<Accumulation>;

  constructor() {
    this.ormRepository = getRepository(Accumulation);
  }

  public async findById(accumulation_id: string): Promise<Accumulation> {
    return this.ormRepository.findOne({
      where: { id: accumulation_id },
      relations: ['entries'],
    });
  }

  public async findByWalletId(wallet_id: string): Promise<Accumulation[]> {
    return this.ormRepository.find({
      where: { wallet_id },
      relations: ['entries'],
    });
  }
}

export default AccumulationsRepository;
