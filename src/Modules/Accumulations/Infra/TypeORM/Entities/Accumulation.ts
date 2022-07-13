import Portfolio from 'Modules/Portfolios/Infra/TypeORM/Entities/Portfolio';
import NumericTransformer from 'Shared/Infra/TypeORM/Transformers/NumericTransformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

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
}

export default Accumulation;
