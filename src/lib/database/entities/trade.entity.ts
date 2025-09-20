import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import type { User } from './user.entity';
import type { SavingsVault } from './savings-vault.entity';

@Entity('trades')
export class Trade {
  @PrimaryGeneratedColumn()
  trade_id: number;

  @Column()
  vault_id: number;

  @Column()
  user_id: number;

  @Column()
  fiat_amount: number;

  @Column()
  fiat_symbol: string;

  @Column()
  token_symbol: string;

  @Column()
  token_amount: number;

  @Column()
  price_executed: number;

  @Column()
  tx_hash: string;

  @CreateDateColumn()
  created_at: Date;

  // Relations
  @ManyToOne('SavingsVault', 'trades')
  @JoinColumn({ name: 'vault_id' })
  savings_vault: SavingsVault;

  @ManyToOne('User', 'trades')
  @JoinColumn({ name: 'user_id' })
  user: User;
}
