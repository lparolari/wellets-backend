import { EntityRepository, getRepository, Repository } from 'typeorm';

import IFindByUserIdDTO from 'Modules/Wallets/DTOs/IFindByUserIdDTO';
import ICreateWalletDTO from 'Modules/Wallets/DTOs/ICreateWalletDTO';
import IWalletsRepository from 'Modules/Wallets/Repositories/IWalletsRepository';
import IFindResponseDTO from 'Modules/Wallets/DTOs/IFindResponseDTO';
import Wallet from '../Entities/Wallet';

@EntityRepository(Wallet)
class WalletsRepository implements IWalletsRepository {
  private ormRepository: Repository<Wallet>;

  constructor() {
    this.ormRepository = getRepository(Wallet);
  }

  public async create(data: ICreateWalletDTO): Promise<Wallet> {
    const wallet = this.ormRepository.create(data);

    await this.ormRepository.save(wallet);

    return wallet;
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
    });

    return wallet;
  }

  public async findByUserId({
    limit,
    page,
    user_id,
  }: IFindByUserIdDTO): Promise<IFindResponseDTO> {
    const [wallets, total] = await this.ormRepository.findAndCount({
      where: {
        user_id,
      },
      take: limit,
      skip: (page - 1) * limit,
      order: {
        alias: 'ASC',
      },
    });

    return {
      wallets,
      total,
    };
  }

  public async findById(id: string, complete?: boolean): Promise<Wallet> {
    const wallet = await this.ormRepository.findOne({
      where: {
        id,
      },
      relations: complete ? ['currency'] : [],
    });

    return wallet;
  }

  public async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }

  public async save(wallet: Wallet): Promise<Wallet> {
    await this.ormRepository.save(wallet);

    return wallet;
  }
}

export default WalletsRepository;
