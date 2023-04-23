import { IIntervalDTO } from './IIntervalDTO';

interface IHistoryDTO {
  asset_id: string;
  interval: IIntervalDTO;
  start: Date;
  end: Date;
}

export default IHistoryDTO;
