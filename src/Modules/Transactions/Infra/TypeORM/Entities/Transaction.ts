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

import Wallet from 'Modules/Wallets/Infra/TypeORM/Entities/Wallet';
import NumericTransformer from 'Shared/Infra/TypeORM/Transformers/NumericTransformer';
import AssetEntry from 'Modules/Assets/Infra/TypeORM/Entities/AssetEntry';

@Entity('transactions')
class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  wallet_id: string;

  @Column('decimal', { transformer: new NumericTransformer() })
  value: number;

  @Column()
  description: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Wallet, wallet => wallet.transactions)
  @JoinColumn({ name: 'wallet_id' })
  wallet: Wallet;

  @OneToOne(() => AssetEntry, asset_entry => asset_entry.transaction)
  asset_entry: AssetEntry;
}

export default Transaction;
