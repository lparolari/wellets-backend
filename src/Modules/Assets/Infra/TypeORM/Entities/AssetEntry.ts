import NumericTransformer from 'Shared/Infra/TypeORM/Transformers/NumericTransformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import Asset from './Asset';

@Entity('assets_entries')
class AssetEntry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('decimal', { transformer: new NumericTransformer() })
  value: number;

  @Column('decimal', { transformer: new NumericTransformer() })
  dollar_rate: number;

  @Column('uuid')
  asset_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Asset, asset => asset.entries)
  @JoinColumn({ name: 'asset_id' })
  asset: Asset;
}

export default AssetEntry;
