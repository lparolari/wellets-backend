interface ICreateAssetEntryDTO {
  asset_id: string;
  transaction_id: string;
  value: number;
  dollar_rate: number;
  created_at?: Date;
}

export default ICreateAssetEntryDTO;
