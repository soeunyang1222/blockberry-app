import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SavingsVaultService } from './savings-vault.service';
import { CreateSavingsVaultDto } from './dto/create-savings-vault.dto';
import { SavingsVault } from './entities/savings-vault.entity';

@ApiTags('savings-vault')
@Controller('savings-vault')
export class SavingsVaultController {
  constructor(private readonly savingsVaultService: SavingsVaultService) {}

  @Post()
  @ApiOperation({ summary: '저금고 생성' })
  @ApiResponse({ status: 201, description: '저금고가 성공적으로 생성되었습니다.', type: SavingsVault })
  create(@Body() createSavingsVaultDto: CreateSavingsVaultDto): Promise<SavingsVault> {
    return this.savingsVaultService.create(createSavingsVaultDto);
  }

  @Get()
  @ApiOperation({ summary: '모든 저금고 조회' })
  @ApiResponse({ status: 200, description: '저금고 목록을 성공적으로 조회했습니다.', type: [SavingsVault] })
  findAll(): Promise<SavingsVault[]> {
    return this.savingsVaultService.findAll();
  }

  @Get(':vault_id')
  @ApiOperation({ summary: '저금고 ID로 조회' })
  @ApiResponse({ status: 200, description: '저금고를 성공적으로 조회했습니다.', type: SavingsVault })
  @ApiResponse({ status: 404, description: '저금고를 찾을 수 없습니다.' })
  findOne(@Param('vault_id', ParseIntPipe) vault_id: number): Promise<SavingsVault> {
    return this.savingsVaultService.findOne(vault_id);
  }

  @Get('user/:user_id')
  @ApiOperation({ summary: '사용자 ID로 저금고 조회' })
  @ApiResponse({ status: 200, description: '사용자의 저금고 목록을 성공적으로 조회했습니다.', type: [SavingsVault] })
  findByUserId(@Param('user_id', ParseIntPipe) user_id: number): Promise<SavingsVault[]> {
    return this.savingsVaultService.findByUserId(user_id);
  }

  @Patch(':vault_id/active')
  @ApiOperation({ summary: '저금고 활성 상태 변경' })
  @ApiResponse({ status: 200, description: '저금고 활성 상태가 성공적으로 변경되었습니다.', type: SavingsVault })
  @ApiResponse({ status: 404, description: '저금고를 찾을 수 없습니다.' })
  updateActiveStatus(
    @Param('vault_id', ParseIntPipe) vault_id: number,
    @Body('active') active: boolean,
  ): Promise<SavingsVault> {
    return this.savingsVaultService.updateActiveStatus(vault_id, active);
  }

  @Delete(':vault_id')
  @ApiOperation({ summary: '저금고 삭제' })
  @ApiResponse({ status: 200, description: '저금고가 성공적으로 삭제되었습니다.' })
  @ApiResponse({ status: 404, description: '저금고를 찾을 수 없습니다.' })
  remove(@Param('vault_id', ParseIntPipe) vault_id: number): Promise<void> {
    return this.savingsVaultService.remove(vault_id);
  }
}
