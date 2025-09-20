import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import type { SavingsVault } from './savings-vault.entity';
import type { Deposit } from './deposit.entity';
import type { Trade } from './trade.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  wallet_address: string;

  @CreateDateColumn()
  created_at: Date;

  // Relations
  @OneToMany('SavingsVault', 'user')
  savings_vaults: SavingsVault[];

  @OneToMany('Deposit', 'user')
  deposits: Deposit[];

  @OneToMany('Trade', 'user')
  trades: Trade[];
}
