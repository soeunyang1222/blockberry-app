import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateDepositDto {
  @ApiProperty({
    description: '저금고 ID',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  vault_id: number;

  @ApiProperty({
    description: '사용자 ID',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  user_id: number;

  @ApiProperty({
    description: '법정화폐 금액',
    example: 100000,
  })
  @IsNumber()
  @IsNotEmpty()
  amount_fiat: number;

  @ApiProperty({
    description: '법정화폐 심볼',
    example: 'KRW',
  })
  @IsString()
  @IsNotEmpty()
  fiat_symbol: string;

  @ApiProperty({
    description: '트랜잭션 해시',
    example: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
  })
  @IsString()
  @IsNotEmpty()
  tx_hash: string;
}
