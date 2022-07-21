interface ICreateAccumulationDTO {
  alias: string;
  strategy: string;
  quote: number;
  planned_entries: number;
  every: {
    years?: number;
    months?: number;
    weeks?: number;
    days?: number;
    hours?: number;
    minutes?: number;
    seconds?: number;
  };
  planned_start: Date;
  planned_end: Date;
  wallet_id: string;
}

export default ICreateAccumulationDTO;
