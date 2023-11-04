import Wallet from '../Infra/TypeORM/Entities/Wallet';
import ICreateWalletDTO from '../DTOs/ICreateWalletDTO';
import IFindByUserIdDTO from '../DTOs/IFindByUserIdDTO';
import IFindResponseDTO from '../DTOs/IFindResponseDTO';
import IOptionsDTO from '../DTOs/IOptionsDTO';

type IUpdateWalletRequest = {
  alias: string;
  balance: number;
  description?: string;
};

interface IWalletsRepository {
  create(data: ICreateWalletDTO): Promise<Wallet>;
  findByUserIdAndAlias(
    user_id: string,
    alias: string,
  ): Promise<Wallet | undefined>;
  findByUserId(data: IFindByUserIdDTO): Promise<IFindResponseDTO>;
  findById(id: string, options?: IOptionsDTO): Promise<Wallet | undefined>;
  update(id: string, data: IUpdateWalletRequest): Promise<Wallet>;
  delete(id: string): Promise<Wallet>;
  save(wallet: Wallet): Promise<Wallet>;
}

export default IWalletsRepository;
