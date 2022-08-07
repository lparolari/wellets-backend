import Asset from '../Infra/TypeORM/Entities/Asset';

interface IAllocationDTO {
  balance: number;
  allocation: number;
  asset: Asset;
}

export default IAllocationDTO;
