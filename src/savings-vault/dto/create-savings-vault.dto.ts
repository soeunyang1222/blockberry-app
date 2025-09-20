import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsBoolean, IsOptional } from 'class-validator';

export class CreateSavingsVaultDto {
  @ApiProperty({
    description: '사용자 ID',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  user_id: number;

  @ApiProperty({
    description: '저금고 이름',
    example: 'My Bitcoin Savings',
  })
  @IsString()
  @IsNotEmpty()
  vault_name: string;

  @ApiProperty({
    description: '대상 토큰',
    example: 'BTC',
  })
  @IsString()
  @IsNotEmpty()
  target_token: string;

  @ApiProperty({
    description: '간격 일수',
    example: 7,
  })
  @IsNumber()
  @IsNotEmpty()
  interval_days: number;

  @ApiProperty({
    description: '법정화폐 금액',
    example: 1000000,
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
    description: '지속 기간 일수',
    example: 365,
  })
  @IsNumber()
  @IsNotEmpty()
  duration_days: number;

  @ApiProperty({
    description: '활성 상태',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  active?: boolean;
}
