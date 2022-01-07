interface ICreatePortfolioDTO {
  alias: string;
  weight: number;
  user_id: string;
  wallet_ids: string[];
  parent_id: string;
}

export default ICreatePortfolioDTO;
