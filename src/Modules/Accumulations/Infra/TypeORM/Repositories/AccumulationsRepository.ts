import { EntityRepository, Repository, getRepository } from 'typeorm';

import ICreateAccumulationEntryDTO from 'Modules/Accumulations/DTOs/ICreateAccumulationEntryDTO';
import ICreateAccumulationDTO from 'Modules/Accumulations/DTOs/ICreateAccumulationDTO';
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

  public async createEntry({
    accumulation,
    transaction,
  }: ICreateAccumulationEntryDTO): Promise<Accumulation> {
    // eslint-disable-next-line no-param-reassign
    accumulation.entries = [...accumulation.entries, transaction];

    await this.ormRepository.save(accumulation);

    return accumulation;
  }

  public async create(data: ICreateAccumulationDTO): Promise<Accumulation> {
    const accumulation = this.ormRepository.create(data);

    await this.ormRepository.save(accumulation);

    return accumulation;
  }
}

export default AccumulationsRepository;
