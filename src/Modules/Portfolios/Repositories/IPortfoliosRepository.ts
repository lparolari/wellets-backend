import Portfolio from '../Infra/TypeORM/Entities/Portfolio';

interface IWalletsRepository {
  find(user_id?: string, parent_id?: string): Promise<Portfolio[]>;
  findById(id: string): Promise<Portfolio | undefined>;
}

export default IWalletsRepository;
