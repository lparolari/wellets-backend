/* eslint-disable max-classes-per-file */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import Wallet from 'Modules/Wallets/Infra/TypeORM/Entities/Wallet';

export class ColumnNumericTransformer {
  to(data: number): number {
    return data;
  }

  from(data: string): number {
    return parseFloat(data);
  }
}

@Entity('wallet_balances')
class WalletBalance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', transformer: new ColumnNumericTransformer() })
  balance: number;

  @Column('uuid')
  wallet_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Wallet, wallet => wallet.balance_history)
  @JoinColumn({ name: 'wallet_id' })
  wallet: Wallet;
}

export default WalletBalance;
