import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import type { User } from './user.entity';
import type { SavingsVault } from './savings-vault.entity';

@Entity('deposits')
export class Deposit {
  @PrimaryGeneratedColumn()
  deposit_id: number;

  @Column()
  vault_id: number;

  @Column()
  user_id: number;

  @Column()
  amount_fiat: number;

  @Column()
  fiat_symbol: string;

  @Column()
  tx_hash: string;

  @CreateDateColumn()
  created_at: Date;

  // Relations
  @ManyToOne('SavingsVault', 'deposits')
  @JoinColumn({ name: 'vault_id' })
  savings_vault: SavingsVault;

  @ManyToOne('User', 'deposits')
  @JoinColumn({ name: 'user_id' })
  user: User;
}
