import Transaction from 'Modules/Transactions/Infra/TypeORM/Entities/Transaction';
import NumericTransformer from 'Shared/Infra/TypeORM/Transformers/NumericTransformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  AfterLoad,
  AfterInsert,
  AfterUpdate,
  ManyToOne,
} from 'typeorm';
import { Duration } from 'date-fns';
import DurationTransformer from 'Shared/Infra/TypeORM/Transformers/DurationTransformer';
import Wallet from 'Modules/Wallets/Infra/TypeORM/Entities/Wallet';

@Entity('accumulations')
class Accumulation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  alias: string;

  @Column()
  strategy: string;

  @Column('decimal', { transformer: new NumericTransformer() })
  quote: number;

  @Column('int')
  planned_entries: number;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Column('interval' as any, { transformer: new DurationTransformer() })
  every: Duration;

  @Column('timestamp')
  planned_start: Date;

  @Column('timestamp')
  planned_end: Date;

  @ManyToOne(() => Wallet)
  @JoinColumn({ name: 'wallet_id' })
  wallet: Wallet;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column('uuid')
  wallet_id: string;

  @ManyToMany(() => Transaction)
  @JoinTable({
    name: 'accumulations_entries',
    joinColumn: { name: 'accumulation_id' },
    inverseJoinColumn: { name: 'transaction_id' },
  })
  entries: Transaction[];

  @AfterLoad()
  @AfterInsert()
  @AfterUpdate()
  async nullChecks(): Promise<void> {
    if (!this.entries) {
      this.entries = [];
    }
  }
}

export default Accumulation;
