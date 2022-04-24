interface IFindParamsDTO {
  user_id: string;
  currency_id?: string;
  sort_by?: 'favorite' | 'acronym';
}

export default IFindParamsDTO;
