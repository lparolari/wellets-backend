interface ICreateWalletDTO {
  alias: string;
  balance?: number;
  user_id: string;
  currency_id: string;
  description?: string;
}

export default ICreateWalletDTO;
