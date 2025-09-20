import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { SavingsVault } from '../../savings-vault/entities/savings-vault.entity';

@Entity('deposits')
export class Deposit {
  @ApiProperty({
    description: '입금 ID',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  deposit_id: number;

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
  amount_fiat: number;

  @ApiProperty({
    description: '법정화폐 심볼',
    example: 'KRW',
  })
  @Column()
  fiat_symbol: string;

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
  @ManyToOne(() => SavingsVault, savingsVault => savingsVault.deposits)
  @JoinColumn({ name: 'vault_id' })
  savings_vault: SavingsVault;

  @ManyToOne(() => User, user => user.deposits)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
