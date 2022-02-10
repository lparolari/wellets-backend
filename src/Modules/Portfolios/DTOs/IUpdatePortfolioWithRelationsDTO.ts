import Portfolio from '../Infra/TypeORM/Entities/Portfolio';
import ICreatePortfolioWithRelationsDTO from './ICreatePortfolioWithRelationsDTO';

interface IUpdatePortfolioWithRelationsDTO
  extends ICreatePortfolioWithRelationsDTO {
  id: string;
  parent: Portfolio;
}

export default IUpdatePortfolioWithRelationsDTO;
