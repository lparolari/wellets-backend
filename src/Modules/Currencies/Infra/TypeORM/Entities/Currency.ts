import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import Wallet from 'Modules/Wallets/Infra/TypeORM/Entities/Wallet';
import NumericTransformer from 'Shared/Infra/TypeORM/Transformers/NumericTransformer';

@Entity('currencies')
class Currency {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 4 })
  acronym: string;

  @Column()
  alias: string;

  @Column('decimal', { transformer: new NumericTransformer() })
  dollar_rate: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Wallet, wallet => wallet.currency)
  wallets: Wallet[];
}

export default Currency;
