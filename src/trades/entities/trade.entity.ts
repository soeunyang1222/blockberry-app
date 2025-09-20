import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { SavingsVault } from '../../savings-vault/entities/savings-vault.entity';

@Entity('trades')
export class Trade {
  @ApiProperty({
    description: '거래 ID',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  trade_id: number;

  @ApiProperty({
    description: '저금고 ID',
    example: 1,
  })
  @Column()
  vault_id: number;

  @ApiProperty({
    description: '사용자 ID',
    example: 1,
  })
  @Column()
  user_id: number;

  @ApiProperty({
    description: '법정화폐 금액',
    example: 100000,
  })
  @Column()
  fiat_amount: number;

  @ApiProperty({
    description: '법정화폐 심볼',
    example: 'KRW',
  })
  @Column()
  fiat_symbol: string;

  @ApiProperty({
    description: '토큰 심볼',
    example: 'BTC',
  })
  @Column()
  token_symbol: string;

  @ApiProperty({
    description: '토큰 금액',
    example: 0.001,
  })
  @Column()
  token_amount: number;

  @ApiProperty({
    description: '실행 가격',
    example: 100000000,
  })
  @Column()
  price_executed: number;

  @ApiProperty({
    description: '트랜잭션 해시',
    example: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
  })
  @Column()
  tx_hash: string;

  @ApiProperty({
    description: '생성일시',
    example: '2024-01-01T00:00:00.000Z',
  })
  @CreateDateColumn()
  created_at: Date;

  // Relations
  @ManyToOne(() => SavingsVault, savingsVault => savingsVault.trades)
  @JoinColumn({ name: 'vault_id' })
  savings_vault: SavingsVault;

  @ManyToOne(() => User, user => user.trades)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
