import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import Wallet from 'Modules/Wallets/Infra/TypeORM/Entities/Wallet';
import NumericTransformer from 'Shared/Infra/TypeORM/Transformers/NumericTransformer';

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

  @Column('decimal', { transformer: new NumericTransformer() })
  dollar_rate: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Wallet, wallet => wallet.transactions)
  @JoinColumn({ name: 'wallet_id' })
  wallet: Wallet;
}

export default Transaction;
