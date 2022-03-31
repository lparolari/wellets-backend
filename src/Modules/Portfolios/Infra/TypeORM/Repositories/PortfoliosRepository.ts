import { EntityRepository, getRepository, IsNull, Repository } from 'typeorm';

import IPortfoliosRepository, {
  IUpdatePortfolioDTO,
} from 'Modules/Portfolios/Repositories/IPortfoliosRepository';

import ICreatePortfolioWithRelationsDTO from 'Modules/Portfolios/DTOs/ICreatePortfolioWithRelationsDTO';

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
      where: {
        user_id,
        parent_id: parent_id || IsNull(),
      },
    });
  }

  public async findByUserId(user_id: string): Promise<Portfolio[]> {
    return this.ormRepository.find({
      relations: ['parent', 'children', 'wallets'],
      where: { user_id },
    });
  }

  public async findByUserIdAndAlias(
    user_id: string,
    alias: string,
  ): Promise<Portfolio> {
    return this.ormRepository.findOne({
      relations: ['parent', 'children', 'wallets'],
      where: { user_id, alias },
    });
  }

  public async findById(id: string): Promise<Portfolio | undefined> {
    return this.ormRepository.findOne({
      where: { id },
      relations: ['parent', 'children', 'wallets'],
    });
  }

  public async create(
    data: ICreatePortfolioWithRelationsDTO,
  ): Promise<Portfolio> {
    const portfolio = this.ormRepository.create(data);
    portfolio.wallets = data.wallets;

    return this.ormRepository.save(portfolio);
  }

  public async update(
    id: string,
    data: IUpdatePortfolioDTO,
  ): Promise<Portfolio> {
    const portfolio = await this.findById(id);
    const newPortfolio = {
      ...portfolio,
      ...data,
    };

    return this.save(newPortfolio);
  }

  public async save(portfolio: Portfolio): Promise<Portfolio> {
    return this.ormRepository.save(portfolio);
  }

  public async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }
}

export default PortfoliosRepository;
