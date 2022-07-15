import Portfolio from 'Modules/Portfolios/Infra/TypeORM/Entities/Portfolio';
import Transaction from 'Modules/Transactions/Infra/TypeORM/Entities/Transaction';
import NumericTransformer from 'Shared/Infra/TypeORM/Transformers/NumericTransformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Duration } from 'date-fns';
import DurationTransformer from 'Shared/Infra/TypeORM/Transformers/DurationTransformer';

@Entity('accumulations')
class Accumulation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  strategy: string;

  @Column('int')
  entries: number;

  @Column('decimal', { transformer: new NumericTransformer() })
  quote: number;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Column('interval' as any, { transformer: new DurationTransformer() })
  every: Duration;

  @Column('date')
  planned_start: Date;

  @Column('date')
  planned_end: Date;

  @ManyToOne(() => Portfolio, portfolio => portfolio.accumulations)
  @JoinColumn({ name: 'portfolio_id' })
  portfolio: Portfolio;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column('uuid')
  portfolio_id: string;

  @ManyToMany(() => Transaction)
  @JoinTable({
    name: 'accumulations_entries',
    joinColumn: { name: 'accumulation_id' },
    inverseJoinColumn: { name: 'transaction_id' },
  })
  accumulation_entries: Transaction[];
}

export default Accumulation;
