export interface IHistoryDTO {
  wallet_id: string;
  interval: '1d';
  start: string;
  end: string;
}

export interface IHistoryResultDTO {
  timestamp: string;
  open: number;
  close: number;
}

interface IWalletBalancesRepository {
  snapshot(): Promise<void>;
  history(data: IHistoryDTO): Promise<IHistoryResultDTO[]>; // TODO: rename to candles
  // TODO: add history method that simply returns the pair (timestamp, balance)
}

export default IWalletBalancesRepository;
