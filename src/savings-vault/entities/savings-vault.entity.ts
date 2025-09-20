import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { Deposit } from '../../deposits/entities/deposit.entity';
import { Trade } from '../../trades/entities/trade.entity';

@Entity('savings_vault')
export class SavingsVault {
  @ApiProperty({
    description: '저금고 ID',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  vault_id: number;

  @ApiProperty({
    description: '사용자 ID',
    example: 1,
  })
  @Column()
  user_id: number;

  @ApiProperty({
    description: '저금고 이름',
    example: 'My Bitcoin Savings',
  })
  @Column()
  vault_name: string;

  @ApiProperty({
    description: '대상 토큰',
    example: 'BTC',
  })
  @Column()
  target_token: string;

  @ApiProperty({
    description: '간격 일수',
    example: 7,
  })
  @Column()
  interval_days: number;

  @ApiProperty({
    description: '법정화폐 금액',
    example: 1000000,
  })
  @Column()
  amount_fiat: number;

  @ApiProperty({
    description: '법정화폐 심볼',
    example: 'KRW',
  })
  @Column()
  fiat_symbol: string;

  @ApiProperty({
    description: '지속 기간 일수',
    example: 365,
  })
  @Column()
  duration_days: number;

  @ApiProperty({
    description: '총 입금액',
    example: 500000,
  })
  @Column({ default: 0 })
  total_deposit: number;

  @ApiProperty({
    description: '활성 상태',
    example: true,
  })
  @Column({ default: true })
  active: boolean;

  @ApiProperty({
    description: '생성일시',
    example: '2024-01-01T00:00:00.000Z',
  })
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
