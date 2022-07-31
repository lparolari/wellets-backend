import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import User from 'Modules/Users/Infra/TypeORM/Entities/User';
import Currency from 'Modules/Currencies/Infra/TypeORM/Entities/Currency';
import NumericTransformer from 'Shared/Infra/TypeORM/Transformers/NumericTransformer';

@Entity('assets')
class Asset {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Currency)
  @JoinColumn({ name: 'currency_id' })
  currency: Currency;
}

export default Asset;
