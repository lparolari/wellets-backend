interface ICreateTransactionDTO {
  wallet_id: string;
  value: number;
  description: string;
  dollar_rate?: number;
  created_at?: Date;
  accumulation_id?: string;
}

export default ICreateTransactionDTO;
