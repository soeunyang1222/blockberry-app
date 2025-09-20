import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AccountResponseDto {
  @ApiProperty({
    description: '계정 주소',
    example: '0x1234567890abcdef1234567890abcdef12345678',
  })
  @IsString()
  accountAddress: string;

  @ApiProperty({
    description: '계정 이름',
    example: 'My Account',
    required: false,
  })
  @IsOptional()
  @IsString()
  accountName?: string;

  @ApiProperty({
    description: '계정 이미지 URL',
    example: 'https://example.com/avatar.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  accountImg?: string;

  @ApiProperty({
    description: '보안 메시지',
    example: 'This account is involved in scam activity',
    required: false,
  })
  @IsOptional()
  @IsString()
  securityMessage?: string;
}
