import IAssetBalanceDTO from './IAssetBalanceDTO';

interface ITimeBalanceDTO extends IAssetBalanceDTO {
  timestamp: string;
}

export default ITimeBalanceDTO;
