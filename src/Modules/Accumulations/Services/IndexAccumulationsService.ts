import { inject, injectable } from 'tsyringe';

import IIndexAccumulationsDTO from '../DTOs/IIndexAccumulationsDTO';
import Accumulation from '../Infra/TypeORM/Entities/Accumulation';
import IAccumulationsRepository from '../Repositories/IAccumulationsRepository';

@injectable()
class IndexAccumulationsService {
  constructor(
    @inject('AccumulationsRepository')
    private accumulationsRepository: IAccumulationsRepository,
  ) {}

  public async execute({
    user_id,
    asset_id,
  }: IIndexAccumulationsDTO): Promise<Accumulation[]> {
    return this.accumulationsRepository.find({ user_id, asset_id });
  }
}

export default IndexAccumulationsService;
