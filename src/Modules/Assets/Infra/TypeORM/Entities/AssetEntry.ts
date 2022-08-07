import Transaction from 'Modules/Transactions/Infra/TypeORM/Entities/Transaction';
import NumericTransformer from 'Shared/Infra/TypeORM/Transformers/NumericTransformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
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

  @Column('uuid')
  transaction_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Asset, asset => asset.entries)
  @JoinColumn({ name: 'asset_id' })
  asset: Asset;

  @OneToOne(() => Transaction, transaction => transaction.asset_entry)
  @JoinColumn({ name: 'transaction_id' })
  transaction: Transaction;
}

export default AssetEntry;
