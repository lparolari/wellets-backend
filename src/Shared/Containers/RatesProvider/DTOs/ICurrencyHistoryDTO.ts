type ICurrencyHistoryDTO = {
  open_time: Date;
  open_price: number;
  high_price: number;
  low_price: number;
  close_price: number;
  volume: number;
}[];

export default ICurrencyHistoryDTO;
