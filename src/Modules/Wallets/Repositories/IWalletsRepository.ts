import Wallet from '../Infra/TypeORM/Entities/Wallet';
import ICreateWalletDTO from '../DTOs/ICreateWalletDTO';
import IFindByUserIdDTO from '../DTOs/IFindByUserIdDTO';
import IFindResponseDTO from '../DTOs/IFindResponseDTO';

interface IWalletsRepository {
  create(data: ICreateWalletDTO): Promise<Wallet>;
  findByUserIdAndAlias(
    user_id: string,
    alias: string,
  ): Promise<Wallet | undefined>;
  findByUserId(data: IFindByUserIdDTO): Promise<IFindResponseDTO>;
  findById(id: string): Promise<Wallet | undefined>;
  delete(id: string): Promise<Wallet>;
  save(wallet: Wallet): Promise<Wallet>;
}

export default IWalletsRepository;
