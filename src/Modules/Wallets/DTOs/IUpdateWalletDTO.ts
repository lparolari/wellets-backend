interface IUpdateWalletDTO {
  wallet_id: string;
  user_id: string;
  alias: string;
  balance: number;
  description?: string;
}

export default IUpdateWalletDTO;
