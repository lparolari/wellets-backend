import { EntityRepository, getRepository, IsNull, Repository } from 'typeorm';

// import IFindByUserIdDTO from 'Modules/Wallets/DTOs/IFindByUserIdDTO';
// import ICreateWalletDTO from 'Modules/Wallets/DTOs/ICreateWalletDTO';
import IPortfoliosRepository from 'Modules/Portfolios/Repositories/IPortfoliosRepository';
// import IFindResponseDTO from 'Modules/Wallets/DTOs/IFindResponseDTO';
// import Wallet from '../Entities/Wallet';
import Portfolio from '../Entities/Portfolio';

@EntityRepository(Portfolio)
class PortfoliosRepository implements IPortfoliosRepository {
  private ormRepository: Repository<Portfolio>;

  constructor() {
    this.ormRepository = getRepository(Portfolio);
  }

  public async find(
    user_id?: string,
    parent_id?: string,
  ): Promise<Portfolio[]> {
    return this.ormRepository.find({
      relations: ['parent', 'children', 'wallets'],
      order: {
        alias: 'ASC',
      },
      where: { user_id, parent_id: parent_id || IsNull() },
    });
  }

  public async findById(id: string): Promise<Portfolio | undefined> {
    return this.ormRepository.findOne({
      where: { id },
      relations: ['parent', 'children', 'wallets'],
    });
  }
}

export default PortfoliosRepository;
