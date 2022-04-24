export interface IHistoryDTO {
  wallet_id: string;
  interval: '1d' | '1w';
  start: Date;
  end: Date;
}
