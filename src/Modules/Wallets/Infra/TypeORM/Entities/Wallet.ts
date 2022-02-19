/* eslint-disable max-classes-per-file */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';

import User from 'Modules/Users/Infra/TypeORM/Entities/User';
import Currency from 'Modules/Currencies/Infra/TypeORM/Entities/Currency';
import Transaction from 'Modules/Transactions/Infra/TypeORM/Entities/Transaction';
import Transfer from 'Modules/Transfers/Infra/TypeORM/Entities/Transfer';
import Portfolio from 'Modules/Portfolios/Infra/TypeORM/Entities/Portfolio';
import WalletBalance from 'Modules/WalletBalances/Infra/TypeORM/Entities/WalletBalance';
import NumericTransformer from 'Shared/Infra/TypeORM/Transformers/NumericTransformer';

@Entity('wallets')
class Wallet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  alias: string;

  @Column({
    type: 'decimal',
    default: 0,
    transformer: new NumericTransformer(),
  })
  balance: number;

  @Column('uuid')
  user_id: string;

  @Column('uuid')
  currency_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, user => user.wallets)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Currency, currency => currency.wallets)
  @JoinColumn({ name: 'currency_id' })
  currency: Currency;

  @OneToMany(() => Transaction, transaction => transaction.wallet)
  transactions: Transaction[];

  @OneToMany(() => Transfer, transfer => transfer.from_wallet)
  from_transfers: Transfer[];

  @OneToMany(() => Transfer, transfer => transfer.to_wallet)
  to_transfers: Transfer[];

  @ManyToMany(() => Portfolio, (portfolio: Portfolio) => portfolio.wallets)
  portfolios: Portfolio[];

  @OneToMany(() => WalletBalance, balance => balance.wallet)
  balance_history: WalletBalance[];
}

export default Wallet;
