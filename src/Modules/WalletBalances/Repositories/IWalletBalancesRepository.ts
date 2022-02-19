import { IBalance } from '../DTOs/IBalance';
import { IHistoryDTO } from '../DTOs/IHistoryDTO';

interface IWalletBalancesRepository {
  snapshot(): Promise<void>;
  history(data: IHistoryDTO): Promise<IBalance[]>;
}

export default IWalletBalancesRepository;
