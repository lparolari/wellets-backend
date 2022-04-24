export interface IHistoryDTO {
  wallet_id: string;
  interval: '1d' | '1w' | '1M';
  start: Date;
  end: Date;
}
