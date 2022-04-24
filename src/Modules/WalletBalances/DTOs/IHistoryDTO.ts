export interface IHistoryDTO {
  wallet_id: string;
  interval: '1h' | '1d' | '1w' | '1M' | '1y';
  start: Date;
  end: Date;
}
