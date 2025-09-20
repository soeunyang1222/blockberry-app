import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Deposit } from './deposit.entity';
import { Trade } from './trade.entity';

@Entity('savings_vault')
export class SavingsVault {
  @PrimaryGeneratedColumn()
  vault_id: number;

  @Column()
  user_id: number;

  @Column()
  vault_name: string;

  @Column()
  target_token: string;

  @Column()
  interval_days: number;

  @Column()
  amount_fiat: number;

  @Column()
  fiat_symbol: string;

  @Column()
  duration_days: number;

  @Column({ default: 0 })
  total_deposit: number;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn()
  created_at: Date;

  // Relations
  @ManyToOne(() => User, user => user.savings_vaults)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Deposit, deposit => deposit.savings_vault)
  deposits: Deposit[];

  @OneToMany(() => Trade, trade => trade.savings_vault)
  trades: Trade[];
}
