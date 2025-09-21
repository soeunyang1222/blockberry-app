import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, Index } from 'typeorm';
import type { SavingsVault } from './savings-vault.entity';
import type { Trade } from './trade.entity';

@Entity('users')
@Index('idx_users_wallet_address', ['wallet_address'])
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 128, unique: true })
  wallet_address: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @Column({ type: 'text', unique: true, nullable: true })
  virtual_account_address: string;

  // Relations
  @OneToMany('SavingsVault', 'user')
  savings_vaults: SavingsVault[];

  @OneToMany('Trade', 'user')
  trades: Trade[];
}
