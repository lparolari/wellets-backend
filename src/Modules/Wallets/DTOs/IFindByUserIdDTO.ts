import IPaginationDTO from 'Shared/DTOs/IPaginationDTO';

interface IFindByUserIdDTO extends IPaginationDTO {
  user_id: string;
  portfolio_id?: string;
}

export default IFindByUserIdDTO;
