import { EntityRepository, getRepository, Repository } from 'typeorm';

import IFindByUserIdDTO from 'Modules/Wallets/DTOs/IFindByUserIdDTO';
import ICreateWalletDTO from 'Modules/Wallets/DTOs/ICreateWalletDTO';
import IWalletsRepository from 'Modules/Wallets/Repositories/IWalletsRepository';
import IFindResponseDTO from 'Modules/Wallets/DTOs/IFindResponseDTO';
import IUpdateWalletDTO from 'Modules/Wallets/DTOs/IUpdateWalletDTO';
import Wallet from '../Entities/Wallet';

@EntityRepository(Wallet)
class WalletsRepository implements IWalletsRepository {
  private ormRepository: Repository<Wallet>;

  constructor() {
    this.ormRepository = getRepository(Wallet);
  }

  public async create(data: ICreateWalletDTO): Promise<Wallet> {
    const wallet = this.ormRepository.create(data);

    const newWallet = await this.ormRepository.save(wallet);

    return this.findById(newWallet.id);
  }

  public async findByUserIdAndAlias(
    user_id: string,
    alias: string,
  ): Promise<Wallet | undefined> {
    const wallet = await this.ormRepository.findOne({
      where: {
        user_id,
        alias,
      },
      relations: ['currency'],
      loadRelationIds: { relations: ['portfolios'] },
    });

    return wallet;
  }

  public async findByUserId({
    limit,
    page,
    user_id,
    portfolio_id,
  }: IFindByUserIdDTO): Promise<IFindResponseDTO> {
    let queryBuilder = this.ormRepository
      .createQueryBuilder('wallet')
      .leftJoin(
        'portfolios_wallets',
        'portfolio_wallet',
        'wallet.id = portfolio_wallet.wallet_id',
      )
      .leftJoinAndSelect(
        'portfolios',
        'portfolio',
        'portfolio_wallet.portfolio_id = portfolio.id',
      )
      .leftJoinAndSelect(
        'wallet.currency',
        'currency',
        'wallet.currency_id = currency.id',
      )
      .loadAllRelationIds({ relations: ['portfolios'] })
      .where('wallet.user_id = :user_id', { user_id })
      .orderBy('wallet.alias', 'ASC');

    if (limit) queryBuilder = queryBuilder.take(limit);

    if (limit && page) queryBuilder = queryBuilder.skip((page - 1) * limit);

    if (portfolio_id) {
      queryBuilder = queryBuilder.andWhere('portfolio.id = :portfolio_id', {
        portfolio_id,
      });
    }

    const [wallets, total] = await queryBuilder.getManyAndCount();

    return {
      wallets,
      total,
    };
  }

  public async findById(id: string): Promise<Wallet> {
    const wallet = await this.ormRepository.findOne({
      where: {
        id,
      },
      relations: ['currency'],
      loadRelationIds: { relations: ['portfolios'] },
    });

    return wallet;
  }

  public async update(id: string, data: IUpdateWalletDTO): Promise<Wallet> {
    const wallet = await this.ormRepository.findOne(id);
    const newWallet = {
      ...wallet,
      ...data,
    };

    await this.save(newWallet);

    return this.findById(id);
  }

  public async delete(id: string): Promise<Wallet> {
    const wallet = await this.findById(id);

    await this.ormRepository.delete(id);

    return wallet;
  }

  public async save(wallet: Wallet): Promise<Wallet> {
    await this.ormRepository.save(wallet);

    return wallet;
  }
}

export default WalletsRepository;
