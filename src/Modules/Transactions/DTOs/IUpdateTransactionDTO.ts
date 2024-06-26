interface IUpdateTransactionDTO {
  transaction_id: string;
  value: number;
  description: string;
  dollar_rate?: number;
  created_at?: Date;
}

export default IUpdateTransactionDTO;
