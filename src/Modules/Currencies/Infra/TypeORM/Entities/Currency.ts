import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import Wallet from 'Modules/Wallets/Infra/TypeORM/Entities/Wallet';
import CurrencyPreference from 'Modules/CurrencyPreferences/Infra/TypeORM/Entities/CurrencyPreference';
import { VirtualColumn } from 'Shared/Infra/TypeORM/Decorators/VirtualColumn';
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

  @VirtualColumn()
  favorite: boolean;

  @OneToMany(() => Wallet, wallet => wallet.currency)
  wallets: Wallet[];

  @OneToMany(
    () => CurrencyPreference,
    currency_preference => currency_preference.currency,
  )
  user_preferences: CurrencyPreference[];
}

export default Currency;
