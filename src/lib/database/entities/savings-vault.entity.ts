import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany, JoinColumn, Index } from 'typeorm';
import type { User } from './user.entity';
import type { Trade } from './trade.entity';

@Entity('savings_vault')
@Index('idx_savings_vault_user_id', ['user_id'])
export class SavingsVault {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  vault_id: number;

  @Column({ type: 'bigint' })
  user_id: number;

  @Column({ type: 'varchar', length: 100 })
  vault_name: string;

  @Column({ type: 'varchar', length: 20 })
  target_token: string;

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  amount_fiat: number;

  @Column({ type: 'varchar', length: 10, default: 'USDC' })
  fiat_symbol: string;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  // Relations
  @ManyToOne('User', 'savings_vaults')
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany('Trade', 'savings_vault')
  trades: Trade[];
}
