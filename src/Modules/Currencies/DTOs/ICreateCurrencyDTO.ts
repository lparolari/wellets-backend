interface ICreateCurrencyDTO {
  acronym: string;
  alias: string;
  dollar_rate: number;
  favorite?: boolean;
  user_id?: string;
}

export default ICreateCurrencyDTO;
