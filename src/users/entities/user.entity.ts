import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { SavingsVault } from '../../savings-vault/entities/savings-vault.entity';
import { Deposit } from '../../deposits/entities/deposit.entity';
import { Trade } from '../../trades/entities/trade.entity';

@Entity('users')
export class User {
  @ApiProperty({
    description: '사용자 ID',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: '지갑 주소',
    example: '0x1234567890abcdef1234567890abcdef12345678',
  })
  @Column({ unique: true })
  wallet_address: string;

  @ApiProperty({
    description: '생성일시',
    example: '2024-01-01T00:00:00.000Z',
  })
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
