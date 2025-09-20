import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { SavingsVault } from './savings-vault.entity';
import { Deposit } from './deposit.entity';
import { Trade } from './trade.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  wallet_address: string;

  @CreateDateColumn()
  created_at: Date;

  // Relations
  @OneToMany(() => SavingsVault, savingsVault => savingsVault.user)
  savings_vaults: SavingsVault[];

  @OneToMany(() => Deposit, deposit => deposit.user)
  deposits: Deposit[];

  @OneToMany(() => Trade, trade => trade.user)
  trades: Trade[];
}
