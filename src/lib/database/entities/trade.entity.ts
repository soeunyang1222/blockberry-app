import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import type { User } from './user.entity';
import type { SavingsVault } from './savings-vault.entity';

@Entity('trades')
@Index('idx_trades_created_at', ['created_at'])
@Index('idx_trades_user_id', ['user_id'])
@Index('idx_trades_vault_id', ['vault_id'])
export class Trade {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  trade_id: number;

  @Column({ type: 'bigint' })
  vault_id: number;

  @Column({ type: 'bigint' })
  user_id: number;

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  fiat_amount: number;

  @Column({ type: 'varchar', length: 10, default: 'USDC' })
  fiat_symbol: string;

  @Column({ type: 'varchar', length: 20 })
  token_symbol: string;

  @Column({ type: 'decimal', precision: 36, scale: 18 })
  token_amount: number;

  @Column({ type: 'decimal', precision: 24, scale: 8 })
  price_executed: number;

  @Column({ type: 'varchar', length: 200, nullable: true })
  tx_hash: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @Column({ type: 'int', nullable: true })
  cycle_index: number;

  // Relations
  @ManyToOne('SavingsVault', 'trades')
  @JoinColumn({ name: 'vault_id' })
  savings_vault: SavingsVault;

  @ManyToOne('User', 'trades')
  @JoinColumn({ name: 'user_id' })
  user: User;
}
