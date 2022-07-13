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
  JoinTable,
} from 'typeorm';

import User from 'Modules/Users/Infra/TypeORM/Entities/User';
import Wallet from 'Modules/Wallets/Infra/TypeORM/Entities/Wallet';
import Accumulation from 'Modules/Accumulations/Infra/TypeORM/Entities/Accumulation';

@Entity('portfolios')
class Portfolio {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  alias: string;

  @Column({ type: 'decimal', default: 1 })
  weight: number;

  @Column('uuid')
  user_id: string;

  @Column('uuid')
  parent_id: string;

  @ManyToOne(() => Portfolio, portfolio => portfolio.children)
  @JoinColumn({ name: 'parent_id' })
  parent: Portfolio;

  @OneToMany(() => Portfolio, portfolio => portfolio.parent)
  children: Portfolio[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, user => user.wallets)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToMany(() => Wallet)
  @JoinTable({
    name: 'portfolios_wallets',
    joinColumn: { name: 'portfolio_id' },
    inverseJoinColumn: { name: 'wallet_id' },
  })
  wallets: Wallet[];

  @OneToMany(() => Accumulation, accumulation => accumulation.portfolio)
  accumulations: Accumulation[];
}

export default Portfolio;
